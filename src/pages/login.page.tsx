import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CloudIcon from '@material-ui/icons/Cloud';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { config } from '../config';
import SocialLoginButton from '../components/socialLoginButton';

export default function LoginPage() {
  const handleGithubLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/github?redirectTo=${config.dashboardDomain}`);
  };

  const handleOidcLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/oidc?redirectTo=${config.dashboardDomain}`);
  };

  const handleGoogleLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/google?redirectTo=${config.dashboardDomain}`);
  };

  const handleLinkedinLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/linkedin?redirectTo=${config.dashboardDomain}`);
  };

  const handleTestLogin = (user: string) => {
    window.location.assign(`${config.backendDomain}/auth/test?redirectTo=${config.dashboardDomain}&user=${user}`);
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h5">Proza admin dashboard - login</Typography>
      <SocialLoginButton
        onClick={handleGithubLogin}
        buttonText="Login with github"
        backgroundColor="#333333"
        color="white"
        icon={<GitHubIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={handleGoogleLogin}
        buttonText="Login with Google"
        backgroundColor="red"
        color="white"
        icon={<CloudIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={handleLinkedinLogin}
        buttonText="Login with Linkedin"
        backgroundColor="blue"
        color="white"
        icon={<LinkedInIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={handleOidcLogin}
        buttonText="Login with OIDC"
        backgroundColor="white"
        color="#333333"
        icon={<LockOpenIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={() => handleTestLogin('user')}
        buttonText="Test login as user"
        backgroundColor="white"
        color="#333333"
        icon={<LockOpenIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={() => handleTestLogin('moderator')}
        buttonText="Test login as moderator"
        backgroundColor="white"
        color="#333333"
        icon={<LockOpenIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={() => handleTestLogin('admin')}
        buttonText="Test login as admin"
        backgroundColor="white"
        color="#333333"
        icon={<LockOpenIcon />}
        width="300px"
      />
    </Grid>
  );
}
