// server.js
const express = require("express");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = 4000;

// Servidor WebSocket para comunicación en tiempo real
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
    let currentDir = process.cwd(); // Directorio actual

    ws.on("message", (message) => {
        const command = message.toString().trim();

        if (command === "cwd") {
            // Devuelve el directorio actual
            ws.send(`Directory: ${currentDir}`);
        } else {
            // Ejecuta el comando en el sistema
            const [cmd, ...args] = command.split(" ");
            const child = spawn(cmd, args, { cwd: currentDir });

            child.stdout.on("data", (data) => {
                ws.send(data.toString());
            });

            child.stderr.on("data", (data) => {
                ws.send(`Error: ${data.toString()}`);
            });

            child.on("close", (code) => {
                ws.send(`Process exited with code ${code}`);
            });
        }
    });
});

// Configuración del servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Conexión HTTP + WebSocket
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});
