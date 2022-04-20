import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Storage } from "@aws-amplify/storage";

// const hasGetUserMedia = !!(
//   navigator.mediaDevices.getUserMedia ||
//   navigator.mediaDevices.webkitGetUserMedia ||
//   navigator.mediaDevices.mozGetUserMedia ||
//   navigator.mediaDevices.msGetUserMedia
// );

function App({ signOut, user }) {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, {
      type: "video",
    });
    recorderRef.current.startRecording();
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      //setBlob(recorderRef.current.getBlob());
    });
  };

  const handleSave = async function () {
    // var obj = "{hello: 'world'};";
    // var blob = new Blob([obj], { type: "application/json" });
    // var toString = Object.prototype.toString;
    // toString.call(blob);
    //var file = new File([blob], "name");
    Storage.put("prueba.webm", recorderRef.current.getBlob(), {
      level: "public",
      contentType: "application/octet-stream",
      progressCallback: (progress) => {
        console.log(progress);
      },
    });

    const file = await Storage.get("prueba.webm", {
      level: "public",
    });
    var newfile = await Storage.get("3285131650.x-matroska", {
      level: "public",
    });

    let blobs = await fetch(newfile).then((r) => r.blob());
    setBlob(blobs);
    invokeSaveAsDialog(blobs);
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <div className="App">
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <header className="App-header">
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button>
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "700px", margin: "1em" }}
          />
        )}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
