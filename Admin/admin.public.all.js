const ADMIN_COOKIE_NAME = "adminExpire";

function clearAdminAccount() {
  app.setCookie(ADMIN_COOKIE_NAME, 'yes', (60 * 24 * 5))
  localStorage.removeItem('adminKey')
  if (!location.href.includes("register")) window.location.href = '../register'
}


if (app.getCookie(ADMIN_COOKIE_NAME) === 'yes') {
  bushido.get('accounts', 'ADMN_8545765435678').then(function(snapshot) {
    if (snapshot.exists()) {
      // continue
    } else {
      clearAdminAccount()
    }
  })
} else {
  clearAdminAccount();
}



// theme 
themeManager.setTheme('blueocean-theme');
