<div align="center">
<h1 align="center">
<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
<br>MQ-WORKER-PLAYGROUND</h1>
<h3>◦ Plunge Into Progress: mq-worker-playground, Your Code's Best Playground!</h3>
<h3>◦ Developed with the software and tools below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/GNU%20Bash-4EAA25.svg?style=flat-square&logo=GNU-Bash&logoColor=white" alt="GNU%20Bash" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat-square&logo=JSON&logoColor=white" alt="JSON" />
</p>
<img src="https://img.shields.io/github/license/squawnchy/mq-worker-playground?style=flat-square&color=5D6D7E" alt="GitHub license" />
<img src="https://img.shields.io/github/last-commit/squawnchy/mq-worker-playground?style=flat-square&color=5D6D7E" alt="git-last-commit" />
<img src="https://img.shields.io/github/commit-activity/m/squawnchy/mq-worker-playground?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/languages/top/squawnchy/mq-worker-playground?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

---

## 📖 Table of Contents
- [📖 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [📦 Features](#-features)
- [📂 repository Structure](#-repository-structure)
- [⚙️ Modules](#modules)
- [🚀 Getting Started](#-getting-started)
    - [🔧 Installation](#-installation)
    - [🤖 Running mq-worker-playground](#-running-mq-worker-playground)
    - [🧪 Tests](#-tests)
- [🛣 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

The mq-worker-playground repository contains a highly efficient demonstration application implemented in Node.js for handling client-server communication via a messaging queue system. The system consists of multiple interlinking components: a client that sends requests and listens for responses, a webserver that manages communication between client and server, and a worker that asynchronously processes messages and returns the results. This setup provides users with a reliable, scalable system for managing requests and responses, making it an excellent solution for high-volume networks or distributed systems.

---

## 📦 Features

|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | The system uses a distributed, event-driven architecture based on a message queue model, involving communication between client, server, and workers using Node.js and websockets.|
| 📄 | **Documentation**  | While the code is comprehensible and compact, the overall system and the purpose of the scripts aren't documented in detail, leaving room for improvement.|
| 🔗 | **Dependencies**   | The system relies on two major dependencies, 'amqplib' for handling AMQP protocol and 'ws' for WebSocket communication.|
| 🧩 | **Modularity**     | The design is modular with well-defined roles for each script (client.js, webserver.js, and worker.js), driving asynchronous, distributed message handling.|
| 🧪 | **Testing**        | The system doesn't incorporate any specific testing strategies or tools as none are specified in the repository. |
| ⚡️ | **Performance**    | The system uses asynchronous handling of messages and proof-of-work computation in the worker, which is likely to enhance performance. |
| 🔐 | **Security**       | There aren't explicit security measures identified in the examined codebase, raising potential concerns about data protection and functional integrity.|
| 🔀 | **Version Control**| The repository includes typical git version control, with a single master branch. Adding more branching strategies can enhance code management.|
| 🔌 | **Integrations**   | The server and worker interact directly with RabbitMQ server, ensuring efficient message delivery and response.|
| 📶 | **Scalability**    | The system demonstrates potential for scalability through its distributed architecture and creation of multiple worker and client processes.|


---


## 📂 Repository Structure

```sh
└── mq-worker-playground/
    ├── client.js
    ├── package-lock.json
    ├── package.json
    ├── run_clients.sh
    ├── webserver.js
    └── worker.js

```

---


## ⚙️ Modules

<details closed><summary>Root</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [client.js](https://github.com/squawnchy/mq-worker-playground/blob/main/client.js)                 | The client.js script is part of a messaging queue system, implemented using Node.js. It establishes a WebSocket connection and sends a word (taken from command line arguments) to a server. It listens for incoming messages, logs them with timestamps and color codes based on their type (acknowledged, finished, or unexpected), and terminates the process as appropriate.                                                                                    |
| [package-lock.json](https://github.com/squawnchy/mq-worker-playground/blob/main/package-lock.json) | The code is a `package-lock.json` file in a Node.js project named message-queue-demo. This file locks the versions of the project's dependencies to ensure consistent installations. The main dependencies used are amqplib, for interacting with AMQP protocol (message queuing), and ws, for handling WebSocket connections. Each dependency states its own version, resolved URL, and subdependencies.                                                           |
| [package.json](https://github.com/squawnchy/mq-worker-playground/blob/main/package.json)           | The code is setting up a message queue demo application with two key dependencies: amqplib and ws. The package.json file shows that the application depends on the Advanced Message Queuing Protocol library (amqplib) and WebSocket (ws) for handling networking communication. The project structure implies it includes a client.js, webserver.js, and worker.js, for client requests, a web server, and message processing respectively.                        |
| [run_clients.sh](https://github.com/squawnchy/mq-worker-playground/blob/main/run_clients.sh)       | The script run_clients.sh is designed to instantly create and run a specified number of Node.js clients, as provided by the user, through the client.js script. It ensures the user inputs the number of clients before execution and returns an error message if not. It then initiates each client in a separate background process.                                                                                                                              |
| [webserver.js](https://github.com/squawnchy/mq-worker-playground/blob/main/webserver.js)           | The code sets up a WebSocket server and establishes a connection to a RabbitMQ server, creating two queues for messaging. On receiving a message from a client, it generates a unique correlationId and sends the message to the Request queue. It listens for messages on the Response queue and forwards them to the correct client using the correlationId. The system acknowledges finished tasks and notifies clients of received messages and completed work. |
| [worker.js](https://github.com/squawnchy/mq-worker-playground/blob/main/worker.js)                 | This code is for a worker node that interacts with a RabbitMQ Server. The worker receives word messages from the word_request_queue, calculates a proof-of-work (POW) hash that starts with 0000 for each message, and sends the word along with its POW back to the word_response_queue. The POW calculation and message handling is done asynchronously to achieve efficient execution.                                                                           |

</details>

---

## 🚀 Getting Started

***Dependencies***

Please ensure you have the following dependencies installed on your system:

`- ℹ️ Dependency 1`

`- ℹ️ Dependency 2`

`- ℹ️ ...`

### 🔧 Installation

1. Clone the mq-worker-playground repository:
```sh
git clone https://github.com/squawnchy/mq-worker-playground
```

2. Change to the project directory:
```sh
cd mq-worker-playground
```

3. Install the dependencies:
```sh
npm install
```

### 🤖 Running mq-worker-playground

```sh
node app.js
```

### 🧪 Tests
```sh
npm test
```

---


## 🛣 Project Roadmap

> - [X] `ℹ️  Task 1: Implement initial playground setup`
> - [ ] `ℹ️  Task 2: Implement monitoring and logging`
> - [ ] `ℹ️ ...`


---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/squawnchy/mq-worker-playground/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/squawnchy/mq-worker-playground/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github.com/squawnchy/mq-worker-playground/issues)**: Submit bugs found or log feature requests for SQUAWNCHY.

#### *Contributing Guidelines*

<details closed>
<summary>Click to expand</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone <your-forked-repo-url>
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear and concise message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License


This project is protected under the [GNU General Public License v3.0](https://github.com/squawnchy/mq-worker-playground/blob/master/LICENSE) License.

[**Return**](#Top)

---

## 👏 Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#Top)

---

