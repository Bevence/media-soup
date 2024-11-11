# Mediasoup - A WebRTC

- Mediasoup is an open source media server that uses Web Real-Time Communication(WebRTC) to enable real time communication applications.
- It acts as a Selective Forward Unit(SFU) optimizing communication by receiving media streams from all participants and forwarding only necessary data to each one.
- This improves performance and remove bandwidth, especially where there are multiple participants.

## Implementation

For the communication between server and client, mediasoup node and mediasoup-client are used respectively.

### Communication between Server and Client

1. As our express server starts, we initialize worker.
2.
