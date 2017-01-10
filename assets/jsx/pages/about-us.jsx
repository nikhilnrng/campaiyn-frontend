const React = require('react');
const ReactDOM = require('react-dom');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const Avatar = require('material-ui/lib/avatar');

const AboutUsPage = React.createClass({

  componentDidMount: function() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  },

  render: function() {
    const avatarStyle = {
      align: 'middle',
      float: 'left'
    };

    return (
      <div className={"container"}>
        <div className={"about-us-cover-photo"}>
          <h1>About Campaiyn</h1>
        </div>
        <Tabs className={"about-us-tabs"}>
          <Tab label="About Campaiyn" className={"about"}>
            <div className={"about-tab-container"}>
              <h1>Welcome to Campaiyn</h1>
              <h2>Campaiyn is a marketing platform that connects people who want <br />
              to spread awareness of a brand or product with unique and <br />
              interesting advertising spaces. </h2>
              <hr />
              <div id="bottom-about-container">
                <div id="team-pic"></div>
                <div id="about-us-text">
                  With Campaiyn, we hope that you, as an advertiser or publisher,
                  can find a more creative and impactful to touch the world. <br /><br />

                  Campaiyn was founded in 2015 by three USC students. Their goal
                  was to create a platform that would eventually disrupt and forever
                  change the way businesses connected with their audiences. <br /><br />

                  Their vision slowly turned from an idea into an actual product
                  that had potential to not only affect just the marketing industry,
                  but also the world. Campaiyn aims to clean up the excessive number of ads.
                  To change the perception of ads from spam to helpful information. To help
                  brands reach only their intended audience without disrupting others.
                  To facilitate a connection that was never possible. And ultimately to
                  expand communication.
                </div>
              </div>
              <div className={"only-clear"}></div>
              <hr className={"hr-space"}/>
            </div>
          </Tab>
          <Tab label="The Team" className={"team"}>
            <div className={"about-tab-container"}>
              <h1>Meet the Team</h1>
              <div className={"campaiyn-team"}>
                <div className={"team-member-info"}>
                  <Avatar size={170} style={avatarStyle} src={"/images/about-us/kerry.jpg"} />
                  <div className={"about-text"}>
                    <br />
                    Kerry Chen is an undergraduate student currently studying Business
                    Administration and Computer Science at the University of Southern
                    California. A year into his university studies, Kerry joined the Chinese
                    Regulatory and Securities Commission in Beijing, China. The following year,
                    Kerry joined the business development team at a marketing startup in Culver
                    City, California called SteelHouse. In the following months, Kerry further
                    developed his marketing knowledge at a career outplacement company called
                    CareerArc. During the summer of 2015, Kerry worked for Ingram Micro, a
                    Fortune 62 distribution company within the Corporate Compliance Strategy
                    and Risk mitigation department.
                  </div>
                </div>
                <div className={"clear"}></div>
                <div className={"team-member-info"}>
                  <Avatar size={170} style={avatarStyle} src={"/images/about-us/bedi.jpg"} />
                  <div className={"about-text"}>
                    <br />
                    Nikhil Bedi is currently a senior studying Software Engineering at the
                    University of Southern California. As a QuestBridge Scholar, Nikhil has
                    excelled in his computer science curriculum, completing all his required
                    classes by the end of his junior year. Nikhil also has extensive software
                    development experience, with two summer internships at Qualcomm, and more
                    recently, a summer internship at LinkedIn in the San Francisco Bay Area. At
                    LinkedIn, Nikhil contributed significantly to the success of Project Voyager
                    as a member of the News Feed UI Team. At Campaiyn, Nikhil has led the back-end
                    development efforts, and served as a project manager on the development of the
                    entire Campaiyn platform.
                  </div>
                </div>
                <div className={"clear"}></div>
                <div className={"team-member-info"}>
                  <Avatar size={170} style={avatarStyle} src={"/images/about-us/narang.jpg"} />
                  <div className={"about-text"}>
                    <br />
                    Nikhil Narang is currently a Senior studying Electrical Engineering at the
                    University of Southern California. Nikhil’s engineering experience includes
                    a job at Tesla Motors in Palo Alto this past summer. As a member of the
                    Passive Safety Team, Nikhil supported the Model X front row and rear seats
                    development, estraints, and crash testing from an electrical perspective.
                    Nikhil’s technical experience is complemented by years of speech and debate,
                    where he eventually competed on the US National Debate Team, representing
                    the United States in the Pan-American Debate Championships.
                  </div>
                </div>
                <div className={"clear"}></div>
              </div>
            </div>
          </Tab>
        </Tabs>

      </div>
    );
  }

});

module.exports = AboutUsPage;
