import React from 'react';
import { getLink } from '../../../utils';

const Item = (props) => {
  const { feature } = props;
  return (
    <li>
      <img src={getLink(feature.img)} />
      <div>
        <h4><a href={getLink(feature.link)} target="_self">{feature.title}</a></h4>
        <p>{feature.content}</p>
      </div>
    </li>
  );
};

export default Item;
