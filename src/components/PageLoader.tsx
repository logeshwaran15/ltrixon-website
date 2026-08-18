import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PageLoader = () => {
  const [loading, setLoading] = useState(() => {
    // Check if the loader has already been shown in this session
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("ltrixon-loader-shown");
    }
    return true;
  });

  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("ltrixon-loader-shown", "true");
    }, 4500);
    return () => clearTimeout(timeout);
  }, [loading]);

  const startLetters = ["L", "T", "R", "I", "X"];
  const endLetter = "N";

  // Random rotation for the falling effect
  const getRandomRotate = () => (Math.random() - 0.5) * 120;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1, delay: 0.8 } }}
        >
          {/* Subtle background glow */}
          <motion.div
            className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, ease: "easeInOut" }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          />

          <div className="relative flex items-center text-3xl md:text-4xl font-black font-heading tracking-widest text-foreground">
            
            {/* L T R I X */}
            {startLetters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                exit={{
                  y: [0, -30, window.innerHeight], // Hop up, then fall to bottom of screen
                  rotate: getRandomRotate(),
                  opacity: [1, 1, 0],
                  transition: { 
                    duration: 0.8, 
                    delay: index * 0.08, // Staggered falling
                    ease: "anticipate" 
                  }
                }}
              >
                {letter}
              </motion.span>
            ))}

            {/* Floating 'O' */}
            <motion.span
              className="relative inline-flex items-center justify-center text-primary mx-1"
              initial={{ y: -150, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: [-150, -140, -150, 0], // Float up and down, then drop
                rotate: [0, 180, 360, 360], // Spin while floating
                opacity: [0, 1, 1, 1],
                scale: [0.5, 1, 1, 1],
              }}
              transition={{
                times: [0, 0.2, 0.7, 1],
                duration: 3,
                ease: "anticipate",
              }}
              exit={{
                y: [0, -40, window.innerHeight], 
                rotate: 200,
                opacity: [1, 1, 0],
                transition: { 
                  duration: 0.8, 
                  delay: startLetters.length * 0.08, 
                  ease: "anticipate" 
                }
              }}
            >
              <span className="relative">O</span>
            </motion.span>

            {/* N */}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: (startLetters.length + 1) * 0.1 }}
              exit={{
                y: [0, -20, window.innerHeight], 
                rotate: getRandomRotate(),
                opacity: [1, 1, 0],
                transition: { 
                  duration: 0.8, 
                  delay: (startLetters.length + 1) * 0.08, 
                  ease: "anticipate" 
                }
              }}
            >
              {endLetter}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
