// Path : src/components/SnackBar/index.tsx

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackBarProps {
  isOpen: boolean;
  message: string;
  severity: any;
  setIsOpen: any;
  isModal?: boolean;
}

const SnackBar: React.FC<SnackBarProps> = ({
  isOpen,
  message,
  severity,
  setIsOpen,
  isModal,
}) => {
  const vertical = "bottom";
  const horizontal = isModal ? "left" : "right";

  type TransitionProps = Omit<SlideProps, "direction">;

  function TransitionRight(props: TransitionProps) {
    return <Slide {...props} direction={isModal ? "left" : "right"} />;
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={TransitionRight}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        sx={{
          // Lift it up a bit
          transform: "translateY(-30px)",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          // Change the color of the alert to #4f747a
          sx={{
            width: "100%",
            backgroundColor:
              severity === "success"
                ? "#4f747a"
                : severity === "error"
                ? "#d32f2f"
                : severity === "warning"
                ? "#ed6c02"
                : severity === "info"
                ? "#0288d1"
                : "black",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
export default SnackBar;