import Enum from "../util/Enum.js"

var DataType = new Enum([
    {
        id: 0x00, name: "Uint8",
        write: (buffer, value) => {buffer.writeUint8(value)},
        read: (buffer) => (buffer.readUint8()),
    },
    {
        id: 0x01, name: "Uint16",
        write: (buffer, value) => {buffer.writeUint16(value)},
        read: (buffer) => (buffer.readUint16()),
    },
    {
        id: 0x02, name: "Uint32",
        write: (buffer, value) => {buffer.writeUint32(value)},
        read: (buffer) => (buffer.readUint32()),
    },
    {
        id: 0x10, name: "Int8",
        write: (buffer, value) => {buffer.writeInt8(value)},
        read: (buffer) => (buffer.readInt8()),
    },
    {
        id: 0x11, name: "Int16",
        write: (buffer, value) => {buffer.writeInt16(value)},
        read: (buffer) => (buffer.readInt16()),
    },
    {
        id: 0x12, name: "Int32",
        write: (buffer, value) => {buffer.writeInt32(value)},
        read: (buffer) => (buffer.readInt32()),
    },
    {
        id: 0x20, name: "Float32",
        write: (buffer, value) => {buffer.writeFloat32(value)},
        read: (buffer) => (buffer.readFloat32()),
    },
    {
        id: 0x30, name: "String",
        write: (buffer, value) => {buffer.writeString(value)},
        read: (buffer) => (buffer.readString()),
    },
])

export default DataType