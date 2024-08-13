import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export default function RevealMenu({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    } else {
      mainControls.start("hidden");
    }
  }, [isInView, mainControls]);
  return (
    <div ref={ref}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1, delay: 0.45 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
