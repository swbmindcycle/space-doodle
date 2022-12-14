import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// Amplify
import { Amplify, Auth, Storage, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Analytics from "./scenes/analytics";

// Amplify Configuration
//import { AmplifyConfig } from "./config/amplify-config";
//Amplify.configure(AmplifyConfig);

function App({ signOut, user }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <>
      {/* <Authenticator loginMechanisms={['email']}  hideSignUp> */}
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              {/* <Router> */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                {/* <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
              </Routes>
              {/* </Router> */}
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
      {/* </Authenticator> */}
    </>
  );
}

export default App;

//export default withAuthenticator(App);
