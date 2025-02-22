import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameCodeContextType {
    gameCode: string | null;
    setGameCode: (code: string | null) => void;
}

const GameCodeContext = createContext<GameCodeContextType | undefined>(undefined);

export const GameCodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameCode, setGameCode] = useState<string | null>(null);
    return (
        <GameCodeContext.Provider value={{ gameCode, setGameCode }}>
            {children}
        </GameCodeContext.Provider>
    );
};

export const useGameCode = () => {
    const context = useContext(GameCodeContext);
    if (!context) {
        throw new Error('useGameCode must be used within a GameCodeProvider');
    }
    return context;
};
