import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';

import { UserProvider, ThemeProvider } from './components/Context';
import { Register } from './components/Register';
import { Splashscreen } from './components/Splashscreen';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { PostReview } from './components/PostReview';
import { PostComment } from './components/PostComment';
import { RecAreas } from './components/RecAreas';
import { Campgrounds } from './components/Campgrounds';
import { SingleRecArea } from './components/SingleRecArea';
import { SingleCampground } from './components/SingleCampground';
import { MyAccount } from './components/MyAccount';
import { NavBar } from './components/NavBar';
import { ScrollToTop } from './components/ScrollToTop';
import { Settings } from './components/Settings';
import { OtherUser } from './components/OtherUser';

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <UserProvider>
        <ThemeProvider>
          <header>
            <NavBar />
          </header>
          <main>
            <Switch>
              <Route exact path="/" component={Splashscreen} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/postreview" component={PostReview} />
              <Route exact path="/:siteCollection/:siteId/postreview" component={PostReview} />
              <Route exact path="/reviews/:id/postcomment" component={PostComment} />
              <Route exact path="/recareas" component={RecAreas} />
              <Route exact path="/campgrounds" component={Campgrounds} />
              <Route exact path="/campgrounds/:id" component={SingleCampground} />
              <Route exact path="/recareas/:id" component={SingleRecArea} />
              <Route exact path="/recareas/:id/campgrounds" component={Campgrounds} />
              <Route exact path="/account" component={MyAccount} />
              <Route exact path="/account/settings" component={Settings} />
              <Route exact path="/users/:id" component={OtherUser} />
              <Route path="/recareas/:id/campgrounds" component={Campgrounds} />
            </Switch>
          </main>
        </ThemeProvider>
      </UserProvider>
    </HashRouter>
  );
};

export default App;
