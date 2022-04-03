import Peer from "peerjs";
import {PeerMediaStreams} from "../components/VideoRoom";
import {Dispatch, SetStateAction} from "react";

export async function getMedia() {
    let stream = null;
    //   navigator.mediaDevices.webkitGetUserMedia ||
    //   navigator.mediaDevices.mozGetUserMedia;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        return stream;
    } catch (err) {
        console.log(err);
    }
}

export async function createPeer(userId : string, peerInstance: React.MutableRefObject<any>,setPeerMedia: Dispatch<SetStateAction<PeerMediaStreams>>){
    if (userId) {
        const peer = new Peer(userId, {
            host: 'peerjs-server-videocall.herokuapp.com',
            port: 443,
            secure: true,
        });
        peerInstance.current = peer;
        peer.on("open", (id) => {
            console.log("My peer id is " + id);
        });

        peer.on("call", async function (call) {
            console.log("Someone is attempting to call you");
            const stream = await getMedia();
            call.answer(stream);
            call.on("stream", function (remoteStream) {
                // remotePeerInstance.current.srcObject = remoteStream;
                setPeerMedia((prevState : PeerMediaStreams) => ({...prevState, [call.peer]: remoteStream}))
            });
        });

        peer.on("error", (err) => {
            console.log(err);
        });

        peer.on("disconnected", () => {
            console.log("Peer connection disconnected");
        });

        peer.on("close", () => {
            console.log("Peer Connection is Closed");
        });
    }
}