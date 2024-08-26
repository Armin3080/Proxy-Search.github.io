const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startButton = document.getElementById("startButton");
const signalData = document.getElementById("signalData");
const copyButton = document.getElementById("copyButton");
const signalInput = document.getElementById("signalInput");
const submitSignalButton = document.getElementById("submitSignalButton");

let localStream;
let remoteStream;
let peerConnection;

startButton.addEventListener("click", start);
copyButton.addEventListener("click", copyToClipboard);
submitSignalButton.addEventListener("click", () => {
    const signal = signalInput.value;
    receiveMessage(signal);
});

async function start() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendMessage(JSON.stringify({ candidate: event.candidate }));
        }
    };

    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendMessage(JSON.stringify({ offer }));
}

function sendMessage(message) {
    signalData.value = message;
}

function receiveMessage(message) {
    const data = JSON.parse(message);

    if (data.offer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        peerConnection.createAnswer().then((answer) => {
            peerConnection.setLocalDescription(answer);
            sendMessage(JSON.stringify({ answer }));
        });
    } else if (data.answer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
}

function copyToClipboard() {
    signalData.select();
    signalData.setSelectionRange(0, 99999); /* برای موبایل‌ها */
    document.execCommand("copy");
    alert("کد سیگنالینگ کپی شد!");
}
