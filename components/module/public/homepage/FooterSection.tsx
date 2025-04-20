import Footer from "@/components/custom/Footer";
import { motion } from "framer-motion";

export default function FooterSection() {
    return (
        <motion.div
        className="w-[300px] md:w-[400px] mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      ><Footer footerClasses="bottom-0 w-full py-4 text-center text-xs text-gray-600  overflow-hidden" linkClasses="text-red-600 hover:underline" showVersion={false} /></motion.div>
    )
}