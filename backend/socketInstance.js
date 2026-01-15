let io;

export const setSocketIO = (ioInstance) => {
    console.log("setting socket io");
    io = ioInstance;
};

export const getSocketIO = () =>{
    if(!io){
        throw new Error("Socket IO not initialized");
    }
    return io;
}
