"use client";

import { motion } from "framer-motion";
import { DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function VerificationSuccess() {
  return (
    <DialogContent>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-3">Email Verified!</h2>
          <p className="text-muted-foreground mb-6">
            Redirecting you to your dashboard...
          </p>
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verification Complete
          </Badge>
        </motion.div>
      </motion.div>
    </DialogContent>
  );
}
