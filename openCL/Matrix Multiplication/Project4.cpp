#include <stdio.h>
#include <sys/time.h>
#include <string.h>
#include <CL/cl.h>

#define N 40
#define BLOCK_SIZE 1

double multiplyMatricies(cl_float *matrix1, cl_float *matrix2, cl_float *results);
char* loadProgSource(const char* filename, const char* preamble, size_t *sz);
long long start_timer();
long long stop_timer(long long start_time, const char *name);

int main()
{
    cl_float *inputMatrix1;
    cl_float *inputMatrix2;
    cl_float *results;
    cl_uint width = N;

    int x, y;
    int data = 0;
    double Kernel_runtime;

    long long vector_generation = start_timer();
    inputMatrix1 = (cl_float *) malloc(sizeof(cl_float) * width * width);
    inputMatrix2 = (cl_float *) malloc(sizeof(cl_float) * width * width);
    results = (cl_float *) malloc(sizeof(cl_float) * width * width);

    for(y = 0; y < width; y++)
    {
        for(x = 0; x < width; x++)
        {
            inputMatrix1[y * width + x] = data;
            inputMatrix2[y * width + x] = data;
            results[y * width + x] = 0;
            data++;
        }
    }
    stop_timer(vector_generation, "\nVector Generation");

    long long Total_Runtime = start_timer();
    Kernel_runtime = multiplyMatricies(inputMatrix1, inputMatrix2, results);
    stop_timer(Total_Runtime, "\nTotal Time Taken.");

    printf("\nGPU Kernel took %f ms to run.\n", Kernel_runtime / (1000 * 1000));

}

//CPU FUNCTION
char* loadProgSource(const char* filename, const char* preamble, size_t *sz) {
  FILE* fptr = NULL;
  size_t szSource, szPreamble, howmany;
  char* sourceString;

  // Open the OpenCL source code file
  fptr = fopen(filename, "r");
  szPreamble = strlen(preamble);

  // Get the length of the source code
  fseek(fptr, 0, SEEK_END);
  szSource = ftell(fptr);
  fseek(fptr, 0, SEEK_SET);

  // Allocate a buffer for the source code string and read it in
  sourceString = (char *) calloc(szSource + szPreamble+1, sizeof(char));
  howmany = fread((sourceString) + szPreamble, szSource, 1, fptr);
  fclose(fptr);
  *sz = szSource + szPreamble;
  sourceString[szSource + szPreamble] = '\0';
  return sourceString;
}

//CPU Preparing the data to be sent to the GPU
double multiplyMatricies(cl_float *matrix1, cl_float *matrix2, cl_float *results)
{
    cl_uint width = N;
    cl_uint area = width * width;
    double runtime;

    //query for platform
    cl_platform_id platform_id;
    cl_uint num_platform_id = 0;
    cl_int err;

    if (clGetPlatformIDs(1, &platform_id, &num_platform_id) != CL_SUCCESS) {
        printf("Unable to get platform_id\n");
        return 1;
    }

    //query for device
    cl_device_id device_id;
    cl_uint num_of_devices = 0;

    if (clGetDeviceIDs(platform_id, CL_DEVICE_TYPE_GPU, 1, &device_id, &num_of_devices) != CL_SUCCESS) {
        printf("Unable to get device_id\n");
        return 1;
    }

    //create a context
    cl_context context;
    cl_context_properties properties[3];

    properties[0] = CL_CONTEXT_PLATFORM;
    properties[1] = (cl_context_properties) platform_id;
    properties[2] = 0;

    context = clCreateContext(properties, 1, &device_id, NULL, NULL, &err);

    //create comman queue
    cl_command_queue command_queue;
    cl_event prof_event;

    command_queue = clCreateCommandQueue(context, device_id, CL_QUEUE_PROFILING_ENABLE, &err);

    size_t kernelSize;
    char *kernelSource;

    long long loadSource_Runtime = start_timer();
    kernelSource = loadProgSource("project4.cl", "", &kernelSize);
    stop_timer(loadSource_Runtime, "\nTime Taken To Load Kernel Source");

    cl_program program;

    // Create a program from the kernel source code
    program = clCreateProgramWithSource(context, 1, (const char **) &kernelSource, NULL, &err);

    // Compile the program
    if (clBuildProgram(program, 0, NULL, NULL, NULL, NULL) != CL_SUCCESS) {
        printf("Error building program\n");

        char buffer[4096];
        size_t length;
        clGetProgramBuildInfo(program, device_id, CL_PROGRAM_BUILD_LOG, sizeof(buffer), buffer, &length);
        printf("%s\n", buffer);
        return 1;
    }

    cl_kernel kernel;

    // Specify which kernel from the program to execute
    kernel = clCreateKernel(program, "hello2", &err);

    //Create buffers for the input and output
    cl_mem input1, input2, output;

    input1 = clCreateBuffer(context, CL_MEM_READ_ONLY, sizeof(float) * area, NULL, NULL);
    input2 = clCreateBuffer(context, CL_MEM_READ_ONLY, sizeof(float) * area, NULL, NULL);
    output = clCreateBuffer(context, CL_MEM_WRITE_ONLY, sizeof(float) * area, NULL, NULL);


    // Load data into the input buffer
    clEnqueueWriteBuffer(command_queue, input1, CL_TRUE, 0, sizeof(float) * area, matrix1, 0, NULL, NULL);
    clEnqueueWriteBuffer(command_queue, input2, CL_TRUE, 0, sizeof(float) * area, matrix2, 0, NULL, NULL);

    //set args
    size_t global[2] = {width, width};
    size_t local[2] = {BLOCK_SIZE, BLOCK_SIZE};
    clSetKernelArg(kernel, 0, sizeof(cl_mem), &input1);
    clSetKernelArg(kernel, 1, sizeof(cl_mem), &input2);
    clSetKernelArg(kernel, 2, sizeof(cl_mem), &output);
    clSetKernelArg(kernel, 3, sizeof(cl_int), &width);

    // Enqueue the kernel command for execution
    clEnqueueNDRangeKernel(command_queue, kernel, 1, NULL, global, local, 0, NULL, &prof_event);
    clFinish(command_queue);

    cl_ulong start_time, end_time;
    size_t return_bytes;

    clGetEventProfilingInfo(prof_event, CL_PROFILING_COMMAND_QUEUED, sizeof(cl_ulong), &start_time, &return_bytes);
    clGetEventProfilingInfo(prof_event, CL_PROFILING_COMMAND_END, sizeof(cl_ulong), &end_time, &return_bytes);

    runtime = (double) (end_time - start_time);

    // Copy the results from out of the output buffer
   clEnqueueReadBuffer(command_queue, output, CL_TRUE, 0, sizeof(float) * area, results, 0, NULL, NULL);

   clReleaseContext(context);
   clReleaseCommandQueue(command_queue);
   clReleaseProgram(program);
   clReleaseKernel(kernel);
   clReleaseMemObject(input1);
   clReleaseMemObject(input2);
   clReleaseMemObject(output);
   clReleaseEvent(prof_event);

   return runtime;
}

// Returns the current time in microseconds
long long start_timer() {
        struct timeval tv;
        gettimeofday(&tv, NULL);
        return tv.tv_sec * 1000000 + tv.tv_usec;
}

// Prints the time elapsed since the specified time in seconds
long long stop_timer(long long start_time, const char *name) {
        struct timeval tv;
        gettimeofday(&tv, NULL);
        long long end_time = tv.tv_sec * 1000000 + tv.tv_usec;
        printf("%s: %.5f sec\n", name, ((float) (end_time - start_time)) / (1000 * 1000));
        return end_time - start_time;
}