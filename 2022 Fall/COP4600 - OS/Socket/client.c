#include <stdio.h>
#include "udp.h"

#define BUFFER_SIZE (1000)

// client code
int main(int argc, char *argv[]) {
    struct sockaddr_in addrSnd, addrRcv;

    int sd = UDP_Open(20000);
    int rc = UDP_FillSockAddr(&addrSnd, "localhost", 10000);

    struct timeval connectionTimeout = {5, 0};
    connectionTimeout.tv_sec = 5;  

    
    setsockopt(sd, SOL_SOCKET, SO_RCVTIMEO, &connectionTimeout, sizeof(connectionTimeout));
    
   
    
    char message[BUFFER_SIZE];
    sprintf(message, "hello world");

    printf("client:: send message [%s]\n", message);
    printf("client:: wait for reply...\n");
    while(1)
    {
    	rc = UDP_Write(sd, &addrSnd, message, BUFFER_SIZE);
    	rc = UDP_Read(sd, &addrRcv, message, BUFFER_SIZE);
    	
    	if(rc == -1)
    	{
    		continue;
    	}
    	else
    	{
    	break;
    	}
    }

    printf("client:: got reply [size:%d contents:(%s)\n", rc, message);
    return 0;
}