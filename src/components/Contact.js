import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faAt, faMapMarkedAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from './Context';

export const Contact = ({ site }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <address id="contact">
      <h2>Contact</h2>
      {site.phone && (
        <div className="phone">
          <FontAwesomeIcon icon={faPhone} color={darkMode ? 'hotPink' : 'green'} />
          <p>{site.phone}</p>
        </div>
      )}
      {site.email && (
        <div className="email">
          <FontAwesomeIcon icon={faAt} color={darkMode ? 'hotPink' : 'green'} />
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      )}
      {site.address1 && (
        <div className="address">
          <FontAwesomeIcon icon={faMapMarkedAlt} color={darkMode ? 'hotPink' : 'green'} />
          <p>
            {site.address1}
            <br />
            {site.address2 && (
              <>
                {site.address2}
                <br />
              </>
            )}
            {site.city}, {site.state}
          </p>
        </div>
      )}
      {site.website && (
        <div className="website">
          <FontAwesomeIcon icon={faGlobe} color={darkMode ? 'hotPink' : 'green'} />
          <p>
            <a href={site.website}>Official website</a>
          </p>
        </div>
      )}
    </address>
  );
};
