#include <stdio.h>
#include <sys/time.h>

#define DIM 512

struct Lock {
  int *mutex;
  Lock( void ) {
    int state = 0;
    cudaMalloc( (void**)& mutex, sizeof(int) );
    cudaMemcpy( mutex, &state, sizeof(int), cudaMemcpyHostToDevice );
  }

  ~Lock( void ) {
    cudaFree( mutex );
  }

  __device__ void lock( void ) {
    while( atomicCAS( mutex, 0, 1 ) != 0 );
  }

  __device__ void unlock( void ) {
   atomicExch( mutex, 0 );
  }
};

// Forward function declarations
float CPU_big_dot(float *A, float *B, int N);
void GPU_big_dot(float *A, float *B, int N);
float *get_random_vector(int N);
void die(const char *message);

template <unsigned int iBlockSize>
__global__ void kernel1(float *g_idata, float *g_odata, unsigned int N)
{
    __shared__ float smem[DIM];

    // set thread ID
    unsigned int tid = threadIdx.x;
    unsigned int idx = blockIdx.x * blockDim.x * 8 + threadIdx.x;

    // convert global data pointer to the local pointer of this block
    float *idata = g_idata + blockIdx.x * blockDim.x * 8;

    // unrolling 8
    if (idx + 7 * blockDim.x < N)
    {
        float a1 = g_idata[idx];
        float a2 = g_idata[idx + blockDim.x];
        float a3 = g_idata[idx + 2 * blockDim.x];
        float a4 = g_idata[idx + 3 * blockDim.x];
        float b1 = g_idata[idx + 4 * blockDim.x];
        float b2 = g_idata[idx + 5 * blockDim.x];
        float b3 = g_idata[idx + 6 * blockDim.x];
        float b4 = g_idata[idx + 7 * blockDim.x];
        g_idata[idx] = a1 + a2 + a3 + a4 + b1 + b2 + b3 + b4;
    }
    smem[tid] = idata[tid];
    __syncthreads();

    // in-place reduction and complete unroll
    if (iBlockSize >= 1024 && tid < 512) smem[tid] += smem[tid + 512];
    __syncthreads();

    if (iBlockSize >= 512 && tid < 256) smem[tid] += smem[tid + 256];
    __syncthreads();

    if (iBlockSize >= 256 && tid < 128) smem[tid] += smem[tid + 128];
    __syncthreads();

    if (iBlockSize >= 128 && tid < 64) smem[tid] += smem[tid + 64];
    __syncthreads();

    // unrolling warp
    if (tid < 32)
    {
        volatile float *vsmem = smem;
        vsmem[tid] += vsmem[tid + 32];
        vsmem[tid] += vsmem[tid + 16];
        vsmem[tid] += vsmem[tid +  8];
        vsmem[tid] += vsmem[tid +  4];
        vsmem[tid] += vsmem[tid +  2];
        vsmem[tid] += vsmem[tid +  1];
    }

    // write result for this block to global mem
    if (tid == 0) g_odata[blockIdx.x] = smem[0];
}

template <unsigned int iBlockSize>
__global__ void kernel2(float *g_idata, float *C, unsigned int N)
{
    __shared__ float smem[DIM];

    // set thread ID
    unsigned int tid = threadIdx.x;
    unsigned int idx = blockIdx.x * blockDim.x * 8 + threadIdx.x;

    // convert global data pointer to the local pointer of this block
    float *idata = g_idata + blockIdx.x * blockDim.x * 8;

    // unrolling 8
    if (idx + 7 * blockDim.x < N)
    {
        float a1 = g_idata[idx];
        float a2 = g_idata[idx + blockDim.x];
        float a3 = g_idata[idx + 2 * blockDim.x];
        float a4 = g_idata[idx + 3 * blockDim.x];
        float b1 = g_idata[idx + 4 * blockDim.x];
        float b2 = g_idata[idx + 5 * blockDim.x];
        float b3 = g_idata[idx + 6 * blockDim.x];
        float b4 = g_idata[idx + 7 * blockDim.x];
        g_idata[idx] = a1 + a2 + a3 + a4 + b1 + b2 + b3 + b4;
    }
    smem[tid] = idata[tid];
    __syncthreads();

    // in-place reduction and complete unroll
    if (iBlockSize >= 1024 && tid < 512) smem[tid] += smem[tid + 512];
    __syncthreads();

    if (iBlockSize >= 512 && tid < 256) smem[tid] += smem[tid + 256];
    __syncthreads();

    if (iBlockSize >= 256 && tid < 128) smem[tid] += smem[tid + 128];
    __syncthreads();

    if (iBlockSize >= 128 && tid < 64) smem[tid] += smem[tid + 64];
    __syncthreads();

    // unrolling warp
    if (tid < 32)
    {
        volatile float *vsmem = smem;
        vsmem[tid] += vsmem[tid + 32];
        vsmem[tid] += vsmem[tid + 16];
        vsmem[tid] += vsmem[tid +  8];
        vsmem[tid] += vsmem[tid +  4];
        vsmem[tid] += vsmem[tid +  2];
        vsmem[tid] += vsmem[tid +  1];
    }

    // write result for this block to global mem
    if (tid == 0) atomicAdd(C, smem[0]);
}

int main(int argc, char **argv) {
        // Seed the random generator (use a constant here for repeatable results)
        srand(10);

        // Determine the vector length
        int N = 1 << 24;

        // Generate two random vectors
        float *A= get_random_vector(N);
        float *B= get_random_vector(N);

        // Compute their dot product on the CPU
        float sumCPU = CPU_big_dot(A, B, N);
        printf("dot product with CPU= %f\n", sumCPU);
        
        // Compute their dot product on the GPU
        GPU_big_dot(A, B, N);

        free(A);
        free(B);
}

// Returns the vector dot product of A and B
float CPU_big_dot(float *A, float *B, int N) {
        // Compute the dot product
        float sum = 0;
        for (int i = 0; i < N; i++) sum += A[i] * B[i];

        // Return the result
        return sum;
}

// A GPU kernel that computes the vector dot product of A and B
// (each thread computes a single value of the result)
__global__ void dot_product_multiplication_kernel(float *A, float *B, float *C, int N) {
        // Determine which element this thread is computing
        int thread_id = threadIdx.x + blockIdx.x * blockDim.x;

        // Compute a single element of the result vector (if the element is valid)
        if (thread_id < N) C[thread_id] = A[thread_id] * B[thread_id];
}

// Returns the vector dot product of A and B (computed on the GPU)
void GPU_big_dot(float *A_CPU, float *B_CPU, int N) {

        // execution configuration
        int blocksize = DIM;   // initial block size

        dim3 block (blocksize, 1);
        dim3 grid  ((N + block.x - 1) / block.x, 1);
        printf("grid %d block %d\n", grid.x, block.x);

        // Allocate GPU memory for the inputs and the result
        int vector_size = N * sizeof(float);
        float *A_GPU = NULL;
        float *B_GPU = NULL;
        float *C_GPU = NULL;
        float *O_GPU = NULL;

        if (cudaMalloc((void **) &A_GPU, vector_size) != cudaSuccess) die("Error allocating GPU memory");
        if (cudaMalloc((void **) &B_GPU, vector_size) != cudaSuccess) die("Error allocating GPU memory");
        if (cudaMalloc((void **) &C_GPU, vector_size) != cudaSuccess) die("Error allocating GPU memory");
        if (cudaMalloc((void **) &O_GPU, grid.x * sizeof(float)) != cudaSuccess) die("Error allocating GPU memory");

        // Transfer the input vectors to GPU memory
        cudaMemcpy(A_GPU, A_CPU, vector_size, cudaMemcpyHostToDevice);
        cudaMemcpy(B_GPU, B_CPU, vector_size, cudaMemcpyHostToDevice);

        // Execute the kernel to compute the vector dot product multiplication part on the GPU
        dot_product_multiplication_kernel<<< grid, block >>> (A_GPU, B_GPU, C_GPU, N);
        cudaDeviceSynchronize();  // this is only needed for timing purposes

        // Check for kernel errors
        cudaError_t error = cudaGetLastError();
        if (error) {
          char message[256];
          sprintf(message, "CUDA error: %s", cudaGetErrorString(error));
          die(message);
        }

        float *C_GPU_saved = NULL;
        if (cudaMalloc((void **) &C_GPU_saved, vector_size) != cudaSuccess) die("Error allocating GPU memory");
        cudaMemcpy(C_GPU_saved, C_GPU, vector_size, cudaMemcpyDeviceToDevice);

        // Allocate CPU memory for the result
        float *O_CPU = (float *) malloc(grid.x * sizeof(float));
        if (O_CPU == NULL) die("Error allocating CPU memory");

        cudaEvent_t start, stop;
        float kernel1_time;
        cudaEventCreate( &start);
        cudaEventCreate( &stop);
        cudaEventRecord( start, 0);
        // Execute the kernel1 to compute the vector dot product on the GPU
        switch (blocksize) {
          case 1024:
            kernel1<1024><<<grid.x/8, block>>>(C_GPU, O_GPU, N);
            break;
          case 512:
            kernel1<512><<<grid.x/8, block>>>(C_GPU, O_GPU, N);
            break;
          case 256:
            kernel1<256><<<grid.x/8, block>>>(C_GPU, O_GPU, N);
            break;
          case 128:
            kernel1<128><<<grid.x/8, block>>>(C_GPU, O_GPU, N);
            break;
          case 64:
            kernel1<64><<<grid.x/8, block>>>(C_GPU, O_GPU, N);
            break;
        }
        cudaDeviceSynchronize();
        cudaEventRecord( stop, 0);
        cudaEventSynchronize(stop);
        cudaEventElapsedTime( &kernel1_time, start, stop);
        printf("Time takes for kernel1: %f ms\n", kernel1_time);

        // Check for kernel errors
        cudaGetLastError();
        if (error) {
          char message[256];
          sprintf(message, "CUDA error: %s", cudaGetErrorString(error));
          die(message);
        }

        cudaMemcpy(O_CPU, O_GPU, grid.x * sizeof(int), cudaMemcpyDeviceToHost);
        float sumKernel1 = 0;
        for (int i = 0; i < grid.x / 8; i++) sumKernel1 += O_CPU[i];
        printf("Dot product with kernel1 = %f\n", sumKernel1);

        float sumKernel2 = 0;
        float *sumKernel2_GPU = NULL;
        if (cudaMalloc((void **) &sumKernel2_GPU, sizeof(float)) != cudaSuccess) die("Error allocating GPU memory");
        cudaMemcpy(sumKernel2_GPU, &sumKernel2, sizeof(float), cudaMemcpyHostToDevice);
        float kernel2_time;
        cudaEventRecord( start, 0);
        // Execute the kernel2 to compute the vector dot product on the GPU
        switch (blocksize) {
          case 1024:
            kernel2<1024><<<grid.x/8, block>>>(C_GPU_saved, sumKernel2_GPU, N);
            break;
          case 512:
            kernel2<512><<<grid.x/8, block>>>(C_GPU_saved, sumKernel2_GPU, N);
            break;
          case 256:
            kernel2<256><<<grid.x/8, block>>>(C_GPU_saved, sumKernel2_GPU, N);
            break;
          case 128:
            kernel2<128><<<grid.x/8, block>>>(C_GPU_saved, sumKernel2_GPU, N);
            break;
          case 64:
            kernel2<64><<<grid.x/8, block>>>(C_GPU_saved, sumKernel2_GPU, N);
            break;
        }
        cudaDeviceSynchronize();
        cudaEventRecord( stop, 0);
        cudaEventSynchronize(stop);
        cudaEventElapsedTime( &kernel2_time, start, stop);
        printf("Time takes for kernel2: %f ms\n", kernel2_time);

        // Check for kernel errors
        cudaGetLastError();
        if (error) {
            char message[256];
            sprintf(message, "CUDA error: %s", cudaGetErrorString(error));
            die(message);
        }

        // Transfer the result from teh GPU to the CPU
        cudaMemcpy(&sumKernel2, sumKernel2_GPU, sizeof(float), cudaMemcpyDeviceToHost);
        printf("Dot product with kernel2 = %f\n", sumKernel2);

        // Compute the speedup or slowdown
        if (kernel1_time > kernel2_time) printf("kernel1 outperformed kernel2 by %.2fx\n", (float) kernel2_time / (float) kernel1_time);
        else printf("kernel2 outperformed kernel1 by %.2fx\n", (float) kernel1_time / (float) kernel2_time);

        cudaFree(A_GPU);
        cudaFree(B_GPU);
        cudaFree(C_GPU);
        cudaFree(O_GPU);
        cudaFree(sumKernel2_GPU);

        free(O_CPU);
}

// Returns a randomized vector containing N elements
float *get_random_vector(int N) {
        if (N < 1) die("Number of elements must be greater than zero");

        // Allocate memory for the vector
        float *V = (float *) malloc(N * sizeof(float));
        if (V == NULL) die("Error allocating CPU memory");

        // Populate the vector with random numbers
        for (int i = 0; i < N; i++) V[i] = (float) rand() / (float) rand();

        // Return the randomized vector
        return V;
}

// Prints the specified message and quits
void die(const char *message) {
        printf("%s\n", message);
        exit(1);
}
