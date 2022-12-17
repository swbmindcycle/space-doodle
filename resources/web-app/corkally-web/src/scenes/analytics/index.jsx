import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const quicksightEmbedUrl = `https://us-east-2.quicksight.aws.amazon.com/sn/embed/share/accounts/${
  process.env.REACT_APP_QUICKSIGHT_ACCOUNT_ID
}/dashboards/${process.env.REACT_APP_QUICKSIGHT_DASHBOARD_ID}`;

const Analytics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" display>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Analytics"
          subtitle="Analyze your trends, sales, and margins"
        />
      </Box>
      <Box>
        <iframe width="100%" height="1080" src={quicksightEmbedUrl} />
      </Box>
    </Box>
  );
};
export default Analytics;
