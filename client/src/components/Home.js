import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  noConversation: {
    display: "flex",
    flexGrow: 8,
    width: "60%",
  },
  noConversationMessage: {
    fontSize: "calc(2vw + 30px)",
    color: "rgb(224, 220, 220)",
    width: "80%",
    maxWidth: "700px",
    margin: "2rem",
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const { user, activeConversation, logout, fetchConversations } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user.id) {
      setIsLoggedIn(true);
    }
  }, [user.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (!user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to='/login' />;
    return <Redirect to='/register' />;
  }

  const handleLogout = async () => {
    await logout(user.id);
  };

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component='main' className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        {(activeConversation && <ActiveChat />) || (
          <div className={classes.noConversation}>
            <span className={classes.noConversationMessage}>
              Select a conversation to start chatting.
            </span>
          </div>
        )}
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
    activeConversation: state.activeConversation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
