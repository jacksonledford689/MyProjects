This code uses openCL to multiply 2 matrices together.

I did my work on the Palmetto Cluster.

I used the run_new script to compile my code (./run_new Project4) //This will probably have to be modified depending on your system.

Inside this directory I included an excel file that contains my Runtime vs Block Size graph.

It seems that blocksize has a great impact on runtime for this problem set up until about blocksize = 8. After this point, the benefits seem to have severe diminishing returns.