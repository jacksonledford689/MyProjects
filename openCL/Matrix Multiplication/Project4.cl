//GPU FUNCTION
__kernel void hello1(__global float *input1, __global float *input2, __global float *output, const int N)
{
  int row = get_global_id(1);
  int col = get_global_id(0);

  float sum = 0.0f;

  for(int i = 0; i < N; i++)
  {
    sum += input1[row*N + i] * input2[i * N + col];
  }

  output[row * N + col] = sum;
}

//GPU FUNCTION
__kernel void hello2(__global float *input1, __global float *input2, __global float *output, const int N)
{
  int row;
  int col = get_global_id(0);

  int iloc = get_local_id(0);

  int nloc = get_local_size(0);

  float sum;
  float Awrk[1024];
  __local float Bwrk[1024];

  for(int i = 0; i < N; i++)
  {
    Awrk[i] = input1[col * N + i];
  }

  for(row = 0; row < N; row++)
  {
    for(int i = iloc; i < N; i += nloc)
    {
      Bwrk[i] = input2[i * N + row];
    }

    barrier(CLK_LOCAL_MEM_FENCE);

    sum = 0.0f;
    for(int i = 0; i < N; i++)
    {
      sum += Awrk[i] * Bwrk[i];
    }

    output[col * N + row] = sum;

    barrier(CLK_LOCAL_MEM_FENCE);
  }
}

