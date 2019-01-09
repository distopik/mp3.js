
declare module 'mp3' {

    export class MP3FrameHeader { }
    export class MP3Stream {
        constructor(bitstream: Bitstream);
    }
    export class MP3Frame {

        decode(stream: MP3Stream): void;
    }
    export class MP3Synth {
        pcm: any;

        frame(frame: MP3Frame): void;
    }
    export class Layer1 { }
    export class Layer2 { }
    export class Layer3 { }


    export class Bitstream {
        constructor(stream: Stream)
    }
    export class AVBuffer { }
    export class BufferList {
        numBuffers: number;
        availableBytes: number;
        availableBuffers: number;

        reset(): Array;
        append(buffer: any): number;
    }
    export class Stream {
        constructor(list: BufferList)
    }
}