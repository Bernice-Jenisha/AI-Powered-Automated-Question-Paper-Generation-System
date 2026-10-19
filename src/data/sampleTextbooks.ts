import { TextbookKnowledgeBase } from '../types';

export const SAMPLE_TEXTBOOKS: TextbookKnowledgeBase[] = [
  {
    id: 'os-textbook',
    title: 'Operating System Concepts & Modern Architecture',
    authorOrEdition: 'Silberschatz, Galvin & Gagne (10th Ed.)',
    subject: 'Computer Science & Engineering',
    description: 'Comprehensive undergraduate textbook covering process synchronization, memory paging, deadlocks, and storage systems.',
    totalChapters: 5,
    totalChunks: 15,
    chapters: [
      {
        id: 'os-ch1',
        number: 1,
        title: 'Process Management, Concurrency & Deadlocks',
        summary: 'Process control blocks, process states, race conditions, mutual exclusion, semaphores, and Coffman conditions for deadlock.',
        keyConcepts: ['Process Control Block (PCB)', 'Context Switching', 'Race Condition', 'Mutual Exclusion', 'Semaphores', 'Deadlock Characterization', "Banker's Algorithm", 'Resource Allocation Graph (RAG)'],
        chunks: [
          {
            id: 'os-ch1-chunk1',
            chapterId: 'os-ch1',
            chapterTitle: 'Process Management, Concurrency & Deadlocks',
            sectionTitle: '1.1 Process Lifecycle, States and Context Switching',
            content: 'A process is an active program execution entity containing program counter, stack, and data segment. A process transitions through five primary states: New, Ready, Running, Waiting, and Terminated. The Operating System manages each process via a Process Control Block (PCB) which stores CPU registers, program counter, CPU scheduling priority, and memory management parameters. Context switching saves the operational state of the currently executing CPU process and restores the saved state of the next ready process, introducing pure computational overhead.',
            keyConcepts: ['Process Control Block (PCB)', 'Context Switching', 'Process States'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'os-ch1-chunk2',
            chapterId: 'os-ch1',
            chapterTitle: 'Process Management, Concurrency & Deadlocks',
            sectionTitle: '1.2 Synchronization, Critical Section and Semaphores',
            content: 'The Critical Section problem requires satisfying three essential criteria: Mutual Exclusion, Progress, and Bounded Waiting. Peterson’s Solution provides a software-based algorithmic approach for two processes using turn and flag flags. For multi-process synchronization, counting semaphores and binary semaphores (mutexes) provide atomic wait() (P) and signal() (V) primitives. Misuse of semaphores can lead to race conditions, priority inversion, or unrecoverable system deadlocks.',
            keyConcepts: ['Critical Section', 'Mutual Exclusion', 'Peterson Algorithm', 'Semaphores', 'Priority Inversion'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'os-ch1-chunk3',
            chapterId: 'os-ch1',
            chapterTitle: 'Process Management, Concurrency & Deadlocks',
            sectionTitle: '1.3 Deadlock Characterization and Prevention',
            content: "A deadlock occurs when processes are permanently blocked because each holds resources requested by another. Four Coffman conditions must hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Deadlock avoidance utilizes knowledge of future requests, exemplified by Dijkstra's Banker's Algorithm for multiple resource types. In Banker's algorithm, the system evaluates Allocation, Max, Available, and Need matrices where Need[i][j] = Max[i][j] - Allocation[i][j] to verify whether a safe state execution vector exists.",
            keyConcepts: ['Coffman Conditions', "Banker's Algorithm", 'Resource Allocation Graph', 'Safe State'],
            cognitiveAffinity: ['Remember', 'Apply', 'Analyze', 'Evaluate']
          }
        ]
      },
      {
        id: 'os-ch2',
        number: 2,
        title: 'CPU Scheduling Algorithms & Threading Models',
        summary: 'Preemptive vs non-preemptive schedulers, FCFS, SJF, Round Robin, Multilevel Feedback Queues, and real-time scheduling criteria.',
        keyConcepts: ['Turnaround Time', 'Waiting Time', 'First-Come First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Multilevel Feedback Queue (MLFQ)', 'Thread Pooling'],
        chunks: [
          {
            id: 'os-ch2-chunk1',
            chapterId: 'os-ch2',
            chapterTitle: 'CPU Scheduling Algorithms & Threading Models',
            sectionTitle: '2.1 CPU Scheduling Criteria & Non-Preemptive Algorithms',
            content: 'Scheduling optimization criteria include CPU Utilization, Throughput, Turnaround Time (completion minus arrival), Waiting Time (total time in ready queue), and Response Time. First-Come First-Served (FCFS) suffers from the Convoy Effect where short CPU-bound tasks queue behind long execution bursts. Shortest Job First (SJF) is provably optimal in minimizing average waiting time, yet requires future CPU burst estimation using exponential smoothing: tau_{n+1} = alpha * t_n + (1 - alpha) * tau_n.',
            keyConcepts: ['Turnaround Time', 'Waiting Time', 'Convoy Effect', 'SJF Optimization', 'Exponential Smoothing'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply', 'Analyze']
          },
          {
            id: 'os-ch2-chunk2',
            chapterId: 'os-ch2',
            chapterTitle: 'CPU Scheduling Algorithms & Threading Models',
            sectionTitle: '2.2 Preemptive Scheduling: Round Robin and MLFQ',
            content: 'Round Robin (RR) assigns each process a discrete time quantum q (typically 10-100 ms). If q is excessively large, RR degenerates into FCFS; if q is too small, context switch overhead dominates CPU execution. Multilevel Feedback Queue (MLFQ) dynamically adjusts process priorities based on observed burst behavior: I/O-bound interactive processes remain at high-priority short-quantum tiers, while compute-intensive tasks descend to lower-priority larger-quantum queues.',
            keyConcepts: ['Round Robin', 'Time Quantum', 'Context Switch Overhead', 'Multilevel Feedback Queue'],
            cognitiveAffinity: ['Apply', 'Analyze', 'Evaluate']
          },
          {
            id: 'os-ch2-chunk3',
            chapterId: 'os-ch2',
            chapterTitle: 'CPU Scheduling Algorithms & Threading Models',
            sectionTitle: '2.3 Kernel vs User Threads and Real-Time Systems',
            content: 'User-level threads (ULT) are scheduled in user space without kernel awareness, offering lightweight creation but blocking the entire process on any synchronous system call. Kernel-level threads (KLT) support true multi-core parallel execution. Real-Time operating systems employ Rate Monotonic Scheduling (RMS) assigning static priorities inversely proportional to period, and Earliest Deadline First (EDF) dynamic scheduling with 100% theoretical utilization bound under independent periodic task assumptions.',
            keyConcepts: ['User vs Kernel Threads', 'Rate Monotonic Scheduling (RMS)', 'Earliest Deadline First (EDF)'],
            cognitiveAffinity: ['Understand', 'Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'os-ch3',
        number: 3,
        title: 'Memory Management & Physical Address Translation',
        summary: 'Base and limit registers, contiguous allocation, internal vs external fragmentation, paging architectures, and TLB translation.',
        keyConcepts: ['Logical vs Physical Address', 'Paging', 'Page Table Entry (PTE)', 'Translation Lookaside Buffer (TLB)', 'Internal Fragmentation', 'External Fragmentation'],
        chunks: [
          {
            id: 'os-ch3-chunk1',
            chapterId: 'os-ch3',
            chapterTitle: 'Memory Management & Physical Address Translation',
            sectionTitle: '3.1 Contiguous Memory Allocation and Fragmentation',
            content: 'Contiguous memory allocation techniques partition memory among processes using variable-sized partitions: First-Fit, Best-Fit, and Worst-Fit. External fragmentation arises when total free memory is adequate to satisfy a request but exists in non-contiguous fragments, requiring memory compaction. Internal fragmentation occurs when allocated partition chunks exceed the requested payload, as in fixed-size blocks.',
            keyConcepts: ['First-Fit', 'Best-Fit', 'External Fragmentation', 'Internal Fragmentation', 'Compaction'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'os-ch3-chunk2',
            chapterId: 'os-ch3',
            chapterTitle: 'Memory Management & Physical Address Translation',
            sectionTitle: '3.2 Paging Hardware and Address Translation',
            content: 'Paging eliminates external fragmentation by partitioning logical address space into fixed-size Pages (size 2^p) and physical memory into identical Frames. A logical address comprises Page Number (p) and Offset (d). The hardware Memory Management Unit (MMU) indexes the Page Table using p to yield physical frame number f, concatenated with d. For a 32-bit architecture with 4KB page size, page offset occupies 12 bits, leaving 20 bits for 1,048,576 page table entries.',
            keyConcepts: ['Paging', 'Page Number', 'Offset', 'Page Table', 'Memory Management Unit (MMU)'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'os-ch3-chunk3',
            chapterId: 'os-ch3',
            chapterTitle: 'Memory Management & Physical Address Translation',
            sectionTitle: '3.3 Translation Lookaside Buffer (TLB) and Effective Access Time',
            content: 'Standard paging requires two memory accesses per data reference: one for the page table entry, one for actual byte retrieval. The Translation Lookaside Buffer (TLB) acts as a high-speed associative hardware cache. Effective Access Time (EAT) is computed as: EAT = Hit_Ratio * (TLB_Search + Mem_Access) + (1 - Hit_Ratio) * (TLB_Search + 2 * Mem_Access). High hit rates (>98%) are critical to maintain instruction pipeline throughput.',
            keyConcepts: ['Translation Lookaside Buffer (TLB)', 'Effective Access Time (EAT)', 'Hit Ratio', 'Associative Memory'],
            cognitiveAffinity: ['Apply', 'Analyze', 'Evaluate']
          }
        ]
      },
      {
        id: 'os-ch4',
        number: 4,
        title: 'Virtual Memory & Page Replacement Strategies',
        summary: 'Demand paging, page fault handling, Belady anomaly, FIFO, LRU, Optimal page replacement, and thrashing prevention.',
        keyConcepts: ['Demand Paging', 'Page Fault', 'Belady Anomaly', 'FIFO Replacement', 'Least Recently Used (LRU)', 'Optimal Page Replacement (OPT)', 'Thrashing', 'Working Set Model'],
        chunks: [
          {
            id: 'os-ch4-chunk1',
            chapterId: 'os-ch4',
            chapterTitle: 'Virtual Memory & Page Replacement Strategies',
            sectionTitle: '4.1 Demand Paging and Page Fault Handling Sequence',
            content: 'Virtual memory isolates logical program address space from physical RAM, enabling processes larger than physical memory. Demand paging loads pages only when referenced. When an invalid bit is encountered in a page table entry, hardware triggers a Page Fault trap to the OS kernel. The OS traps, locates the page on backing store disk, allocates a free frame, issues disk I/O, updates the page table valid bit, and restarts the trapped instruction.',
            keyConcepts: ['Virtual Memory', 'Demand Paging', 'Page Fault Trap', 'Valid-Invalid Bit', 'Backing Store'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'os-ch4-chunk2',
            chapterId: 'os-ch4',
            chapterTitle: 'Virtual Memory & Page Replacement Strategies',
            sectionTitle: '4.2 Page Replacement Algorithms and Belady Anomaly',
            content: 'When physical memory is depleted, a victim frame must be selected for eviction. First-In-First-Out (FIFO) exhibits Belady’s Anomaly, where increasing allocated page frames paradoxically increases page fault frequency. Optimal (OPT) replaces the page that will not be used for the longest future duration, serving as theoretical upper bound. Least Recently Used (LRU) exploits temporal locality by replacing the page unreferenced for the longest past interval, implemented via counters or stack architectures.',
            keyConcepts: ["Belady's Anomaly", 'FIFO Page Replacement', 'LRU Replacement', 'Optimal Algorithm (OPT)', 'Temporal Locality'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze', 'Evaluate']
          },
          {
            id: 'os-ch4-chunk3',
            chapterId: 'os-ch4',
            chapterTitle: 'Virtual Memory & Page Replacement Strategies',
            sectionTitle: '4.3 Thrashing and the Working Set Model',
            content: 'Thrashing occurs when a computer spends more time paging frames in and out of disk than executing instructions, dropping CPU utilization to near zero. Thrashing results from processes lacking sufficient frames to accommodate their active localities. Denning’s Working Set Model defines parameter Delta (window size) to track all unique pages referenced in the last Delta instructions. If sum of working set sizes WSS_i exceeds total available frames, the OS suspends processes to restore stability.',
            keyConcepts: ['Thrashing', 'Working Set Model', 'Locality of Reference', 'Page Fault Frequency'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'os-ch5',
        number: 5,
        title: 'Storage Architecture & File System Implementation',
        summary: 'Inodes, directory structures, contiguous/linked/indexed file allocation, RAID levels 0-6, and disk scheduling algorithms.',
        keyConcepts: ['Inode', 'File Allocation Table (FAT)', 'Indexed Allocation', 'SSTF', 'SCAN & C-SCAN', 'RAID 0, 1, 5, 6'],
        chunks: [
          {
            id: 'os-ch5-chunk1',
            chapterId: 'os-ch5',
            chapterTitle: 'Storage Architecture & File System Implementation',
            sectionTitle: '5.1 Inode Structure and File Allocation Methods',
            content: 'Unix file systems represent files via Index Nodes (inodes). An inode stores file metadata (permissions, owner, size, timestamps) and direct block pointers (typically 12), single indirect, double indirect, and triple indirect block pointers. Contiguous allocation guarantees fast sequential access but suffers from external fragmentation. Linked allocation eliminates fragmentation but exhibits poor random access. Indexed allocation consolidates pointers into index blocks, supporting direct random offset computation.',
            keyConcepts: ['Inode', 'Direct & Indirect Pointers', 'Contiguous Allocation', 'Linked Allocation', 'Indexed Allocation'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'os-ch5-chunk2',
            chapterId: 'os-ch5',
            chapterTitle: 'Storage Architecture & File System Implementation',
            sectionTitle: '5.2 Disk Arm Scheduling: FCFS, SSTF, SCAN and C-SCAN',
            content: 'Mechanical hard disk access latency comprises Seek Time (arm movement), Rotational Latency, and Transfer Time. Seek Time dominates latency. Shortest Seek Time First (SSTF) services requests closest to current head position, but can starve distant cylinders. SCAN (Elevator algorithm) sweeps the disk arm unidirectionally to the boundary, reversing direction. Circular SCAN (C-SCAN) returns immediately to the start without servicing requests on the reverse trip, offering more uniform waiting times.',
            keyConcepts: ['Seek Time', 'SSTF', 'SCAN Algorithm', 'C-SCAN Algorithm', 'Rotational Latency'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'os-ch5-chunk3',
            chapterId: 'os-ch5',
            chapterTitle: 'Storage Architecture & File System Implementation',
            sectionTitle: '5.3 RAID Architectures and Fault Tolerance',
            content: 'Redundant Array of Independent Disks (RAID) balances performance and fault tolerance. RAID 0 provides striping without parity (high performance, zero redundancy). RAID 1 provides disk mirroring (50% storage efficiency). RAID 5 distributes block-level parity across N disks (tolerates 1 disk failure, capacity = (N-1) * disk_size). RAID 6 incorporates dual Reed-Solomon parity schemes to survive simultaneous dual disk failures in enterprise storage arrays.',
            keyConcepts: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'Parity Striping', 'Fault Tolerance'],
            cognitiveAffinity: ['Remember', 'Analyze', 'Evaluate', 'Create']
          }
        ]
      }
    ]
  },
  {
    id: 'cn-textbook',
    title: 'Computer Networking: Protocols, Architectures & Security',
    authorOrEdition: 'Kurose & Ross (8th Edition)',
    subject: 'Computer Science & Telecommunications',
    description: 'Layered networking textbook covering TCP/UDP, BGP/OSPF routing, DNS, congestion control, and public-key cryptography.',
    totalChapters: 5,
    totalChunks: 15,
    chapters: [
      {
        id: 'cn-ch1',
        number: 1,
        title: 'Network Core, Packet Switching & Protocol Stacks',
        summary: 'Packet switching vs circuit switching, nodal delay components, throughput, OSI 7-layer vs TCP/IP 5-layer model.',
        keyConcepts: ['Packet Switching', 'Circuit Switching', 'Propagation Delay', 'Transmission Delay', 'Queuing Delay', 'OSI Model', 'Encapsulation'],
        chunks: [
          {
            id: 'cn-ch1-chunk1',
            chapterId: 'cn-ch1',
            chapterTitle: 'Network Core, Packet Switching & Protocol Stacks',
            sectionTitle: '1.1 Packet Switching and Delay Components',
            content: 'In packet-switched networks, messages are divided into packets of length L bits transmitted across links with transmission rate R bps. Total nodal delay comprises: Nodal Processing Delay (d_proc), Queuing Delay (d_queue) governed by traffic intensity (L*a)/R, Transmission Delay (d_trans = L / R), and Propagation Delay (d_prop = d / s where s is propagation speed ~2*10^8 m/s). When traffic intensity approaches 1, queuing delays grow exponentially.',
            keyConcepts: ['Packet Switching', 'Transmission Delay', 'Propagation Delay', 'Traffic Intensity'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'cn-ch1-chunk2',
            chapterId: 'cn-ch1',
            chapterTitle: 'Network Core, Packet Switching & Protocol Stacks',
            sectionTitle: '1.2 Protocol Layering and Encapsulation',
            content: 'The Internet 5-layer architecture encompasses Application (HTTP, DNS), Transport (TCP, UDP), Network (IP, ICMP), Link (Ethernet, WiFi), and Physical layers. As data traverses the stack from sender to receiver, each layer prepends a header containing control information—a process termed Encapsulation. Routers inspect up to Layer 3, whereas Layer 2 switches inspect only Link-layer frames, maintaining strict abstraction boundaries.',
            keyConcepts: ['Protocol Layers', 'Encapsulation', 'Decapsulation', 'Header Overhead'],
            cognitiveAffinity: ['Understand', 'Analyze']
          },
          {
            id: 'cn-ch1-chunk3',
            chapterId: 'cn-ch1',
            chapterTitle: 'Network Core, Packet Switching & Protocol Stacks',
            sectionTitle: '1.3 Throughput and Bottleneck Links',
            content: 'Instantaneous throughput represents the rate (in bps) at which a destination host receives data. Average throughput is constrained by the bottleneck link—the link on the end-to-end transmission path with the minimal transmission capacity min(R_1, R_2, ..., R_n). In shared networks, competing flows divide bandwidth according to transport layer fairness mechanisms.',
            keyConcepts: ['Bottleneck Link', 'End-to-End Throughput', 'Fairness'],
            cognitiveAffinity: ['Apply', 'Analyze', 'Evaluate']
          }
        ]
      },
      {
        id: 'cn-ch2',
        number: 2,
        title: 'Transport Layer Protocols: TCP, UDP & Congestion Control',
        summary: 'Reliable data transfer, TCP 3-way handshake, sliding window, fast retransmit, AIMD, Slow Start, and UDP socket architectures.',
        keyConcepts: ['TCP 3-Way Handshake', 'UDP Datagrams', 'Selective Repeat', 'Go-Back-N', 'AIMD Congestion Control', 'Slow Start', 'Fast Recovery'],
        chunks: [
          {
            id: 'cn-ch2-chunk1',
            chapterId: 'cn-ch2',
            chapterTitle: 'Transport Layer Protocols: TCP, UDP & Congestion Control',
            sectionTitle: '2.1 Connection Establishment: TCP Three-Way Handshake',
            content: 'TCP provides connection-oriented, reliable, byte-stream delivery. Connection setup requires a Three-Way Handshake: 1) Client sends SYN packet with Initial Sequence Number (ISN_c); 2) Server responds with SYN-ACK packet containing its own ISN_s and ACK = ISN_c + 1; 3) Client sends ACK = ISN_s + 1, completing the connection. Connection teardown utilizes FIN-ACK sequences across four steps with a 2*MSL TIME_WAIT state to drain lingering in-flight packets.',
            keyConcepts: ['Three-Way Handshake', 'SYN Flood Attack', 'TIME_WAIT State', 'Initial Sequence Number'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'cn-ch2-chunk2',
            chapterId: 'cn-ch2',
            chapterTitle: 'Transport Layer Protocols: TCP, UDP & Congestion Control',
            sectionTitle: '2.2 Flow Control and Sliding Window Protocols',
            content: 'TCP ensures flow control by matching sender transmission rate with receiver buffer capacity. The receiver advertises Receive Window (rwnd) in every acknowledgment header. The sender guarantees that (LastByteSent - LastByteAcked) <= min(rwnd, cwnd). In Go-Back-N, the sender can transmit N unacknowledged packets but retransmits all unacknowledged packets upon timeout. Selective Repeat acknowledges individual packets, retransmitting only corrupt or lost segments.',
            keyConcepts: ['Flow Control', 'Receive Window (rwnd)', 'Go-Back-N', 'Selective Repeat', 'Sliding Window'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'cn-ch2-chunk3',
            chapterId: 'cn-ch2',
            chapterTitle: 'Transport Layer Protocols: TCP, UDP & Congestion Control',
            sectionTitle: '2.3 TCP Congestion Control: AIMD and Tahoe vs Reno',
            content: 'TCP Reno congestion control employs four interrelated mechanisms: Slow Start (exponential window growth doubling cwnd every RTT), Congestion Avoidance (linear growth adding 1 MSS per RTT upon reaching ssthresh), Fast Retransmit (detecting packet loss upon receiving 3 duplicate ACKs without waiting for timer expiry), and Fast Recovery. Under AIMD, additive increase adds 1 MSS/RTT, while multiplicative decrease halves cwnd upon loss, proving convergence to Pareto efficiency.',
            keyConcepts: ['Additive Increase Multiplicative Decrease (AIMD)', 'Slow Start', 'Fast Retransmit', 'Duplicate ACKs', 'ssthresh'],
            cognitiveAffinity: ['Apply', 'Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'cn-ch3',
        number: 3,
        title: 'Network Layer: Addressing, Subnetting & Routing Algorithms',
        summary: 'IPv4 vs IPv6 headers, CIDR subnetting, NAT translation, Dijkstra link-state, Bellman-Ford distance-vector, and BGP inter-domain routing.',
        keyConcepts: ['IPv4 Addressing', 'CIDR Notation', 'Subnet Mask', 'NAT Translation', 'Dijkstra Algorithm', 'Bellman-Ford Algorithm', 'Count to Infinity', 'BGP'],
        chunks: [
          {
            id: 'cn-ch3-chunk1',
            chapterId: 'cn-ch3',
            chapterTitle: 'Network Layer: Addressing, Subnetting & Routing Algorithms',
            sectionTitle: '3.1 IPv4 Classless Inter-Domain Routing (CIDR) and Subnetting',
            content: 'IPv4 utilizes 32-bit addresses written in dotted decimal notation. CIDR replaces legacy Class A/B/C allocations with prefix format a.b.c.d/x, where x designates the leading network prefix bits and (32 - x) designates host bits. For instance, a /26 subnet allocates 2^(32-26) = 64 IP addresses, of which 62 are assignable to hosts (reserving network address and broadcast address). Subnet masks enable routers to perform longest prefix matching.',
            keyConcepts: ['CIDR Subnetting', 'Subnet Mask', 'Broadcast Address', 'Longest Prefix Matching'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'cn-ch3-chunk2',
            chapterId: 'cn-ch3',
            chapterTitle: 'Network Layer: Addressing, Subnetting & Routing Algorithms',
            sectionTitle: '3.2 Link-State (OSPF) vs Distance-Vector (RIP) Routing',
            content: 'Intra-Autonomous System routing employs either Link-State or Distance-Vector algorithms. Link-State (OSPF) broadcasts topology packets across the network, enabling each node to execute Dijkstra’s algorithm to determine shortest path tree with O(V^2) or O(E log V) complexity. Distance-Vector (RIP) uses decentralized Bellman-Ford updates: d_x(y) = min_v { c(x,v) + d_v(y) }. Distance-Vector suffers from the Count-to-Infinity problem upon link failure, mitigated by Poison Reverse and Split Horizon.',
            keyConcepts: ["Dijkstra's Algorithm", 'Bellman-Ford Equation', 'Count-to-Infinity', 'Split Horizon', 'OSPF vs RIP'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze', 'Evaluate']
          },
          {
            id: 'cn-ch3-chunk3',
            chapterId: 'cn-ch3',
            chapterTitle: 'Network Layer: Addressing, Subnetting & Routing Algorithms',
            sectionTitle: '3.3 Border Gateway Protocol (BGP) and Policy-Based Routing',
            content: 'The Internet glue is BGP (Border Gateway Protocol), an inter-domain Path-Vector protocol. Unlike intra-AS interior gateway protocols that minimize link cost, BGP routes are dictated by autonomous business and political policies (e.g. peering vs customer-transit agreements). BGP advertisements convey AS-PATH attributes to prevent routing loops, and NEXT-HOP attributes to specify router interface mapping.',
            keyConcepts: ['Border Gateway Protocol (BGP)', 'Path Vector', 'AS-PATH', 'Policy-Based Routing', 'Transit vs Peering'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'cn-ch4',
        number: 4,
        title: 'Application Layer Services: HTTP/2/3, DNS & CDN',
        summary: 'HTTP 1.1 vs HTTP/2 multiplexing vs HTTP/3 QUIC, DNS iterative vs recursive queries, and CDN edge caching architectures.',
        keyConcepts: ['HTTP/1.1 Pipelining', 'HTTP/2 Streams', 'HTTP/3 QUIC (UDP)', 'Head-of-Line Blocking', 'DNS Hierarchy', 'Iterative vs Recursive DNS', 'CDN Edge Caching'],
        chunks: [
          {
            id: 'cn-ch4-chunk1',
            chapterId: 'cn-ch4',
            chapterTitle: 'Application Layer Services: HTTP/2/3, DNS & CDN',
            sectionTitle: '4.1 Evolution of HTTP: HTTP/1.1, HTTP/2 and HTTP/3 QUIC',
            content: 'HTTP/1.1 introduced persistent connections but suffered from Head-of-Line (HoL) blocking on single TCP streams. HTTP/2 addressed this with binary framing and stream multiplexing over a single TCP connection, but still experienced transport-layer HoL blocking if a TCP packet dropped. HTTP/3 eliminates TCP entirely, operating over QUIC on top of UDP with independent stream encryption, zero-RTT connection resumption, and connection migration across client IP network transitions.',
            keyConcepts: ['Head-of-Line Blocking', 'HTTP/2 Multiplexing', 'QUIC Protocol', 'Zero-RTT Handshake'],
            cognitiveAffinity: ['Remember', 'Understand', 'Analyze', 'Evaluate']
          },
          {
            id: 'cn-ch4-chunk2',
            chapterId: 'cn-ch4',
            chapterTitle: 'Application Layer Services: HTTP/2/3, DNS & CDN',
            sectionTitle: '4.2 Domain Name System (DNS) Architecture and Resolution',
            content: 'DNS provides distributed hierarchical name resolution mapping hostnames to IP addresses. The hierarchy comprises Root DNS servers, Top-Level Domain (TLD) servers (.com, .org), and Authoritative servers. Queries execute either recursively (where the local DNS server takes complete responsibility to return the IP) or iteratively (where queried servers reply with referral pointers to downstream DNS authorities). DNS utilizes UDP port 53 with caching TTL.',
            keyConcepts: ['DNS Hierarchy', 'Recursive vs Iterative Query', 'Authoritative Nameserver', 'TTL Caching'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'cn-ch4-chunk3',
            chapterId: 'cn-ch4',
            chapterTitle: 'Application Layer Services: HTTP/2/3, DNS & CDN',
            sectionTitle: '4.3 Content Delivery Networks (CDNs) and Anycast',
            content: 'CDNs distribute web static and streaming media through geographically dispersed surrogate caches (Points of Presence - PoPs). CDNs intercept client requests via DNS Redirection or BGP Anycast routing, directing users to the topologically proximate edge cache. Cache invalidation strategies utilize Cache-Control headers, ETags, and stale-while-revalidate directives to balance freshness with origin server offload.',
            keyConcepts: ['Content Delivery Network (CDN)', 'BGP Anycast', 'Edge Caching', 'ETags', 'Cache Invalidation'],
            cognitiveAffinity: ['Apply', 'Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'cn-ch5',
        number: 5,
        title: 'Network Security, Public-Key Cryptography & TLS',
        summary: 'CIA triad, symmetric AES vs asymmetric RSA/ECC, digital signatures, X.509 certificates, TLS 1.3 handshake, and IPSec.',
        keyConcepts: ['Confidentiality, Integrity, Authenticity (CIA)', 'AES Encryption', 'RSA Algorithm', 'Diffie-Hellman', 'Digital Certificates', 'TLS 1.3', 'IPSec Tunneling'],
        chunks: [
          {
            id: 'cn-ch5-chunk1',
            chapterId: 'cn-ch5',
            chapterTitle: 'Network Security, Public-Key Cryptography & TLS',
            sectionTitle: '5.1 Symmetric vs Asymmetric Cryptography and RSA Mathematics',
            content: 'Symmetric encryption (AES) shares a single key for encryption and decryption, offering rapid throughput for bulk payload. Asymmetric cryptography employs public-private key pairs. The RSA algorithm relies on the computational intractability of factoring large semi-primes: choose primes p and q, calculate modulus n = p * q and Euler totient phi(n) = (p-1)*(q-1), select e coprime to phi(n), and compute private exponent d = e^-1 mod phi(n). Ciphertext C = M^e mod n; Decryption M = C^d mod n.',
            keyConcepts: ['Symmetric vs Asymmetric', 'RSA Key Generation', 'Modular Arithmetic', 'Euler Totient'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'cn-ch5-chunk2',
            chapterId: 'cn-ch5',
            chapterTitle: 'Network Security, Public-Key Cryptography & TLS',
            sectionTitle: '5.2 Digital Signatures, Public Key Infrastructure (PKI) and Certificates',
            content: 'A Digital Signature provides authenticity, integrity, and non-repudiation: the sender hashes the message H(M) and encrypts the digest with their private key. The receiver decrypts using the sender’s public key and verifies that the computed hash matches. To prevent Man-in-the-Middle (MitM) spoofing of public keys, Certificate Authorities (CAs) issue X.509 digital certificates binding an identity to a public key via a trusted CA root signature.',
            keyConcepts: ['Digital Signatures', 'Message Authentication Code (MAC)', 'Certificate Authority (CA)', 'X.509', 'Man-in-the-Middle'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'cn-ch5-chunk3',
            chapterId: 'cn-ch5',
            chapterTitle: 'Network Security, Public-Key Cryptography & TLS',
            sectionTitle: '5.3 TLS 1.3 Handshake and Perfect Forward Secrecy',
            content: 'Transport Layer Security (TLS 1.3) protects TCP communications. TLS 1.3 removed legacy insecure cipher suites and reduced handshake latency to a single round trip (1-RTT). Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) key exchange ensures Perfect Forward Secrecy (PFS), meaning that long-term compromise of a server’s private signing key cannot retroactively decrypt past captured network session traffic.',
            keyConcepts: ['TLS 1.3 Handshake', 'Perfect Forward Secrecy (PFS)', 'Diffie-Hellman Key Exchange', 'Session Resumption'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      }
    ]
  },
  {
    id: 'ml-textbook',
    title: 'Machine Learning & Deep Neural Architectures',
    authorOrEdition: 'Goodfellow, Bengio & Courville (MIT Press)',
    subject: 'Artificial Intelligence & Data Science',
    description: 'Advanced textbook spanning supervised learning, loss functions, backpropagation calculus, CNNs, attention mechanisms, and transformers.',
    totalChapters: 4,
    totalChunks: 12,
    chapters: [
      {
        id: 'ml-ch1',
        number: 1,
        title: 'Supervised Learning, Loss Landscapes & Gradient Optimization',
        summary: 'Linear regression, logistic sigmoid cross-entropy, stochastic gradient descent, Adam optimizer, and bias-variance tradeoff.',
        keyConcepts: ['Mean Squared Error', 'Binary Cross-Entropy', 'Stochastic Gradient Descent (SGD)', 'Momentum', 'Adam Optimizer', 'Bias-Variance Tradeoff'],
        chunks: [
          {
            id: 'ml-ch1-chunk1',
            chapterId: 'ml-ch1',
            chapterTitle: 'Supervised Learning, Loss Landscapes & Gradient Optimization',
            sectionTitle: '1.1 Gradient Descent Optimization and Variants',
            content: 'Gradient descent minimizes empirical risk over parameter space theta. Batch gradient descent evaluates gradients across the entire training corpus N, becoming computationally prohibitive for large datasets. Stochastic Gradient Descent (SGD) updates parameters on single examples, introducing high variance gradient noise. Mini-batch SGD strikes an optimal compromise. Adaptive optimizers like Adam combine exponential moving averages of gradients (first moment m_t) and squared gradients (second moment v_t) with bias correction: theta_{t+1} = theta_t - lr * m_hat / (sqrt(v_hat) + epsilon).',
            keyConcepts: ['Batch vs Stochastic Gradient Descent', 'Mini-batch', 'Adam Optimizer', 'Learning Rate Scheduling'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'ml-ch1-chunk2',
            chapterId: 'ml-ch1',
            chapterTitle: 'Supervised Learning, Loss Landscapes & Gradient Optimization',
            sectionTitle: '1.2 Loss Functions and Maximum Likelihood Estimation',
            content: 'Supervised loss functions correspond directly to negative log-likelihood under probability assumptions. For regression with Gaussian noise, minimizing Mean Squared Error (MSE) is equivalent to Maximum Likelihood Estimation. For multi-class classification, categorical cross-entropy loss L = - sum y_i * log(p_i) paired with the Softmax activation function p_i = exp(z_i) / sum exp(z_j) penalizes incorrect confident predictions exponentially.',
            keyConcepts: ['Mean Squared Error', 'Categorical Cross-Entropy', 'Softmax Activation', 'Maximum Likelihood Estimation'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'ml-ch1-chunk3',
            chapterId: 'ml-ch1',
            chapterTitle: 'Supervised Learning, Loss Landscapes & Gradient Optimization',
            sectionTitle: '1.3 Bias-Variance Tradeoff and Regularization',
            content: 'Expected generalization error decomposes into: Bias^2 + Variance + Irreducible Error. High bias indicates underfitting; high variance indicates overfitting. Regularization techniques constrain model complexity: L2 regularization (Ridge / Weight Decay) penalizes sum of squared weights, shrinking parameters toward zero; L1 regularization (Lasso) penalizes absolute weight magnitude, inducing parameter sparsity.',
            keyConcepts: ['Bias-Variance Decomposition', 'Underfitting vs Overfitting', 'L1 vs L2 Regularization', 'Weight Decay'],
            cognitiveAffinity: ['Analyze', 'Evaluate']
          }
        ]
      },
      {
        id: 'ml-ch2',
        number: 2,
        title: 'Deep Feedforward Networks & Backpropagation',
        summary: 'Multilayer perceptrons, activation functions (ReLU, GELU), matrix calculus chain rule, vanishing/exploding gradients, and Batch Normalization.',
        keyConcepts: ['Multilayer Perceptron (MLP)', 'Vanishing Gradient Problem', 'ReLU & GELU', 'Backpropagation Calculus', 'Batch Normalization', 'Dropout'],
        chunks: [
          {
            id: 'ml-ch2-chunk1',
            chapterId: 'ml-ch2',
            chapterTitle: 'Deep Feedforward Networks & Backpropagation',
            sectionTitle: '2.1 Backpropagation and Computational Graphs',
            content: 'Backpropagation computes the gradient of loss L with respect to all network weights W via recursive application of the multivariable chain rule on directed acyclic computational graphs. Forward propagation computes intermediate activations a^[l] = g(W^[l] a^[l-1] + b^[l]). Backward pass propagates delta^[l] = dL/dz^[l], computing parameter updates dW^[l] = delta^[l] (a^[l-1])^T. Computational complexity per training step scales linearly with number of edges in the graph.',
            keyConcepts: ['Chain Rule', 'Computational Graph', 'Forward Pass', 'Backward Pass', 'Gradient Accumulation'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'ml-ch2-chunk2',
            chapterId: 'ml-ch2',
            chapterTitle: 'Deep Feedforward Networks & Backpropagation',
            sectionTitle: '2.2 Vanishing/Exploding Gradients and Non-linear Activations',
            content: 'Traditional sigmoid and tanh activations saturate at extreme values, causing their first derivatives to approach zero (sigma prime <= 0.25). In networks with depth L, repeated product of sub-unity derivatives causes vanishing gradients, halting learning in initial layers. Rectified Linear Units (ReLU: f(x) = max(0, x)) maintain constant unity gradient for positive inputs, eliminating saturation, though vulnerable to Dying ReLU mitigated by Leaky ReLU and GELU.',
            keyConcepts: ['Vanishing Gradient Problem', 'Exploding Gradients', 'Sigmoid Saturation', 'ReLU vs Leaky ReLU', 'GELU'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'ml-ch2-chunk3',
            chapterId: 'ml-ch2',
            chapterTitle: 'Deep Feedforward Networks & Backpropagation',
            sectionTitle: '2.3 Batch Normalization and Residual Connections',
            content: 'Internal covariate shift refers to changes in the distribution of internal layer inputs during training. Batch Normalization normalizes activations across mini-batch statistics: x_hat = (x - mu_B) / sqrt(sigma_B^2 + eps), followed by learnable scale (gamma) and shift (beta) transformations. Deep ResNets introduce identity skip connections F(x) + x, enabling gradient signals to flow unattenuated through hundreds of layers during backpropagation.',
            keyConcepts: ['Batch Normalization', 'Internal Covariate Shift', 'Residual Connections (ResNet)', 'Skip Connections'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'ml-ch3',
        number: 3,
        title: 'Convolutional Neural Networks (CNNs) & Spatial Features',
        summary: '2D Convolutions, kernels, stride, padding, pooling layers, receptive field calculation, and iconic architectures (VGG, ResNet).',
        keyConcepts: ['Convolution Operation', 'Stride and Padding', 'Receptive Field', 'Max Pooling', 'Feature Maps', 'ResNet Architecture'],
        chunks: [
          {
            id: 'ml-ch3-chunk1',
            chapterId: 'ml-ch3',
            chapterTitle: 'Convolutional Neural Networks (CNNs) & Spatial Features',
            sectionTitle: '3.1 Convolution Mechanics: Stride, Padding and Output Dimensions',
            content: 'Unlike fully connected layers that ignore 2D spatial topology, Convolutional layers exploit spatial locality and parameter sharing. A 2D convolution slides a kernel K of size (k_h, k_w) across input feature map X. For an input of spatial dimension (W, H), padding P, stride S, and kernel size K, the resulting output dimension is given by: O = floor((W - K + 2*P) / S) + 1. Parameter sharing dramatically reduces parameter counts compared to dense matrices.',
            keyConcepts: ['Convolution Formula', 'Parameter Sharing', 'Stride and Padding', 'Output Spatial Dimensions'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'ml-ch3-chunk2',
            chapterId: 'ml-ch3',
            chapterTitle: 'Convolutional Neural Networks (CNNs) & Spatial Features',
            sectionTitle: '3.2 Receptive Field and Pooling Operations',
            content: 'The Receptive Field is the spatial region of the input image that influences a specific unit in a deeper feature map. Stacking multiple small 3x3 convolution layers achieves the effective receptive field of a 7x7 layer while using fewer parameters and incorporating additional non-linear activations. Max pooling and Average pooling downsample spatial dimensions, providing translation invariance and reducing memory footprint.',
            keyConcepts: ['Effective Receptive Field', 'Max Pooling', 'Translation Invariance', '3x3 Kernel Efficiency'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'ml-ch3-chunk3',
            chapterId: 'ml-ch3',
            chapterTitle: 'Convolutional Neural Networks (CNNs) & Spatial Features',
            sectionTitle: '3.3 Advanced Vision Architectures: Inception and ResNet',
            content: 'GoogLeNet Inception modules process multiple receptive field scales simultaneously by executing 1x1, 3x3, and 5x5 filters in parallel concatenated across channels, using 1x1 convolutions for dimensionality reduction. Deep Residual Networks (ResNet) utilize residual blocks H(x) = F(x) + x, solving the degradation problem and allowing training of networks exceeding 152 layers.',
            keyConcepts: ['1x1 Convolutions', 'Inception Architecture', 'Degradation Problem', 'Residual Learning'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      },
      {
        id: 'ml-ch4',
        number: 4,
        title: 'Attention Mechanisms & Transformer Architectures',
        summary: 'Recurrent limitations, Scaled Dot-Product Attention, Multi-Head Attention, positional encodings, encoder-decoder transformers.',
        keyConcepts: ['Scaled Dot-Product Attention', 'Queries, Keys, Values (Q, K, V)', 'Multi-Head Attention', 'Positional Encoding', 'Transformer Architecture'],
        chunks: [
          {
            id: 'ml-ch4-chunk1',
            chapterId: 'ml-ch4',
            chapterTitle: 'Attention Mechanisms & Transformer Architectures',
            sectionTitle: '4.1 Scaled Dot-Product Attention Formulation',
            content: 'Transformers eliminate sequential recurrence, enabling massive parallelization during training. Scaled Dot-Product Attention maps queries Q, keys K, and values V according to: Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V. The scaling factor 1/sqrt(d_k) prevents dot products from growing excessively large for large dimensions, which would push softmax into regions with vanishingly small gradients.',
            keyConcepts: ['Scaled Dot-Product Attention', 'Softmax Scaling Factor', 'Queries Keys Values', 'Vanishing Gradients in Softmax'],
            cognitiveAffinity: ['Remember', 'Understand', 'Apply']
          },
          {
            id: 'ml-ch4-chunk2',
            chapterId: 'ml-ch4',
            chapterTitle: 'Attention Mechanisms & Transformer Architectures',
            sectionTitle: '4.2 Multi-Head Attention and Positional Encodings',
            content: 'Multi-Head Attention projects Q, K, and V into h distinct representation subspaces: MultiHead(Q,K,V) = Concat(head_1, ..., head_h) * W^O, allowing the model to jointly attend to information from different representation positions. Because attention is permutation invariant, sinusoidal or learned Positional Encodings PE(pos, 2i) = sin(pos / 10000^(2i/d_model)) are injected into input embeddings to preserve token sequence ordering.',
            keyConcepts: ['Multi-Head Attention', 'Subspace Projections', 'Positional Encodings', 'Permutation Invariance'],
            cognitiveAffinity: ['Understand', 'Apply', 'Analyze']
          },
          {
            id: 'ml-ch4-chunk3',
            chapterId: 'ml-ch4',
            chapterTitle: 'Attention Mechanisms & Transformer Architectures',
            sectionTitle: '4.3 Transformer Scaling, Pretraining and Causal Masking',
            content: 'In autoregressive decoder transformers (such as GPT architectures), causal attention masking applies an upper-triangular matrix of -infinity to prevent attention from attending to subsequent tokens. Encoder-decoder architectures (such as T5 or original Transformer) employ cross-attention where queries originate from the decoder while keys and values originate from the encoder.',
            keyConcepts: ['Causal Masking', 'Encoder-Decoder vs Decoder-Only', 'Cross-Attention', 'Autoregressive Modeling'],
            cognitiveAffinity: ['Analyze', 'Evaluate', 'Create']
          }
        ]
      }
    ]
  }
];
