var Bitstream;

Bitstream = (function () {
  function Bitstream (stream) {
    this.stream = stream;
    this.bitPosition = 0;
  }

  Bitstream.prototype.copy = function () {
    var result;
    result = new Bitstream (this.stream.copy ());
    result.bitPosition = this.bitPosition;
    return result;
  };

  Bitstream.prototype.offset = function () {
    return 8 * this.stream.offset + this.bitPosition;
  };

  Bitstream.prototype.available = function (bits) {
    return this.stream.available ((bits + 8 - this.bitPosition) / 8);
  };

  Bitstream.prototype.advance = function (bits) {
    var pos;
    pos = this.bitPosition + bits;
    this.stream.advance (pos >> 3);
    return (this.bitPosition = pos & 7);
  };

  Bitstream.prototype.rewind = function (bits) {
    var pos;
    pos = this.bitPosition - bits;
    this.stream.rewind (Math.abs (pos >> 3));
    return (this.bitPosition = pos & 7);
  };

  Bitstream.prototype.seek = function (offset) {
    var curOffset;
    curOffset = this.offset ();
    if (offset > curOffset) {
      return this.advance (offset - curOffset);
    } else if (offset < curOffset) {
      return this.rewind (curOffset - offset);
    }
  };

  Bitstream.prototype.align = function () {
    if (this.bitPosition !== 0) {
      this.bitPosition = 0;
      return this.stream.advance (1);
    }
  };

  Bitstream.prototype.read = function (bits, signed) {
    var a, a0, a1, a2, a3, a4, mBits;
    if (bits === 0) {
      return 0;
    }
    mBits = bits + this.bitPosition;
    if (mBits <= 8) {
      a =
        ((this.stream.peekUInt8 () << this.bitPosition) & 0xff) >>> (8 - bits);
    } else if (mBits <= 16) {
      a =
        ((this.stream.peekUInt16 () << this.bitPosition) & 0xffff) >>>
        (16 - bits);
    } else if (mBits <= 24) {
      a =
        ((this.stream.peekUInt24 () << this.bitPosition) & 0xffffff) >>>
        (24 - bits);
    } else if (mBits <= 32) {
      a = this.stream.peekUInt32 () << this.bitPosition >>> (32 - bits);
    } else if (mBits <= 40) {
      a0 = this.stream.peekUInt8 (0) * 0x0100000000;
      a1 = this.stream.peekUInt8 (1) << 24 >>> 0;
      a2 = this.stream.peekUInt8 (2) << 16;
      a3 = this.stream.peekUInt8 (3) << 8;
      a4 = this.stream.peekUInt8 (4);
      a = a0 + a1 + a2 + a3 + a4;
      a %= Math.pow (2, 40 - this.bitPosition);
      a = Math.floor (a / Math.pow (2, 40 - this.bitPosition - bits));
    } else {
      throw new Error ('Too many bits!');
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if ((a / Math.pow (2, bits - 1)) | 0) {
          a = (Math.pow (2, bits) - a) * -1;
        }
      }
    }
    this.advance (bits);
    return a;
  };

  Bitstream.prototype.peek = function (bits, signed) {
    var a, a0, a1, a2, a3, a4, mBits;
    if (bits === 0) {
      return 0;
    }
    mBits = bits + this.bitPosition;
    if (mBits <= 8) {
      a =
        ((this.stream.peekUInt8 () << this.bitPosition) & 0xff) >>> (8 - bits);
    } else if (mBits <= 16) {
      a =
        ((this.stream.peekUInt16 () << this.bitPosition) & 0xffff) >>>
        (16 - bits);
    } else if (mBits <= 24) {
      a =
        ((this.stream.peekUInt24 () << this.bitPosition) & 0xffffff) >>>
        (24 - bits);
    } else if (mBits <= 32) {
      a = this.stream.peekUInt32 () << this.bitPosition >>> (32 - bits);
    } else if (mBits <= 40) {
      a0 = this.stream.peekUInt8 (0) * 0x0100000000;
      a1 = this.stream.peekUInt8 (1) << 24 >>> 0;
      a2 = this.stream.peekUInt8 (2) << 16;
      a3 = this.stream.peekUInt8 (3) << 8;
      a4 = this.stream.peekUInt8 (4);
      a = a0 + a1 + a2 + a3 + a4;
      a %= Math.pow (2, 40 - this.bitPosition);
      a = Math.floor (a / Math.pow (2, 40 - this.bitPosition - bits));
    } else {
      throw new Error ('Too many bits!');
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if ((a / Math.pow (2, bits - 1)) | 0) {
          a = (Math.pow (2, bits) - a) * -1;
        }
      }
    }
    return a;
  };

  Bitstream.prototype.readLSB = function (bits, signed) {
    var a, mBits;
    if (bits === 0) {
      return 0;
    }
    if (bits > 40) {
      throw new Error ('Too many bits!');
    }
    mBits = bits + this.bitPosition;
    a = this.stream.peekUInt8 (0) >>> this.bitPosition;
    if (mBits > 8) {
      a |= this.stream.peekUInt8 (1) << (8 - this.bitPosition);
    }
    if (mBits > 16) {
      a |= this.stream.peekUInt8 (2) << (16 - this.bitPosition);
    }
    if (mBits > 24) {
      a += this.stream.peekUInt8 (3) << (24 - this.bitPosition) >>> 0;
    }
    if (mBits > 32) {
      a += this.stream.peekUInt8 (4) * Math.pow (2, 32 - this.bitPosition);
    }
    if (mBits >= 32) {
      a %= Math.pow (2, bits);
    } else {
      a &= (1 << bits) - 1;
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if ((a / Math.pow (2, bits - 1)) | 0) {
          a = (Math.pow (2, bits) - a) * -1;
        }
      }
    }
    this.advance (bits);
    return a;
  };

  Bitstream.prototype.peekLSB = function (bits, signed) {
    var a, mBits;
    if (bits === 0) {
      return 0;
    }
    if (bits > 40) {
      throw new Error ('Too many bits!');
    }
    mBits = bits + this.bitPosition;
    a = this.stream.peekUInt8 (0) >>> this.bitPosition;
    if (mBits > 8) {
      a |= this.stream.peekUInt8 (1) << (8 - this.bitPosition);
    }
    if (mBits > 16) {
      a |= this.stream.peekUInt8 (2) << (16 - this.bitPosition);
    }
    if (mBits > 24) {
      a += this.stream.peekUInt8 (3) << (24 - this.bitPosition) >>> 0;
    }
    if (mBits > 32) {
      a += this.stream.peekUInt8 (4) * Math.pow (2, 32 - this.bitPosition);
    }
    if (mBits >= 32) {
      a %= Math.pow (2, bits);
    } else {
      a &= (1 << bits) - 1;
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if ((a / Math.pow (2, bits - 1)) | 0) {
          a = (Math.pow (2, bits) - a) * -1;
        }
      }
    }
    return a;
  };

  return Bitstream;
}) ();

module.exports = Bitstream;
