let io;

export const setSocketIO = (ioInstance) => {
    io = ioInstance;
};

export const getSocketIO = () =>{
    if(!io){
        throw new Error("Socket IO not initialized");
    }
    return io;
}
