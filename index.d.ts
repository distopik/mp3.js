


interface MP3FrameHeader { }
interface MP3Stream { }
interface MP3Frame { }
interface MP3Synth { }
interface Layer1 { }
interface Layer2 { }
interface Layer3 { }


interface Bitstream { }
interface AVBuffer { }
interface BufferList { }
interface Stream { }

interface mp3 {
    MP3FrameHeader: MP3FrameHeader
    MP3Stream: MP3Stream;
    MP3Frame: MP3Frame;
    MP3Synth: MP3Synth;
    Layer1: Layer1;
    Layer2: Layer2;
    Layer3: Layer3;

    Bitstream: Bitstream;
    AVBuffer: AVBuffer;
    BufferList: BufferList;
    Stream: Stream;
}

declare module 'mp3' {
    var main: mp3
    export = main
}