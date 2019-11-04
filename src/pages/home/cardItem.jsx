import React from 'react';
import { getLink } from '../../../utils';
import { Card, Icon,Divider,Button,Rate, Col, Row,Typography,Tabs} from 'antd';
import 'antd/dist/antd.css';

const Item = (props) => {
  const { cardItem } = props;
  const { Title, Paragraph, Text } = Typography;
  const gridStyle = {
        marginTop: '10px',
  };
  return(
      <Row type="flex">
      {
          cardItem.children.map((itemList, i) => {
              if( i%3 === 0){

              }else{

              }
                  return (<Col span={8} >
                      <Card
                          style={{ width: 300 ,marginBottom:'20px'}}
                          cover={
                              <img
                                  alt={itemList.img.alt}
                                  src={itemList.img.src}
                              />
                          }
                          actions={[
                              <Button type="link" size="small" icon={itemList.buttons[0].icon}
                                      href={itemList.buttons[0].href}/>,
                              <Button type="link" size="small" icon={itemList.buttons[1].icon}
                                      href={itemList.buttons[1].href}/>,
                              <Button type="link" size="small" icon={itemList.buttons[2].icon}
                                      href={itemList.buttons[2].href}/>,
                          ]}
                      >
                          <Divider style={{ padding: '10px 0' }}>{itemList.title}</Divider>
                          <Paragraph>
                              {itemList.description}
                          </Paragraph>
                          {
                              itemList.categories.map((category) => {
                                  return (

                                      <span>
                                      <Divider/>
                                  <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />&nbsp;&nbsp;
                                          <a href={category.link}>{category.title}</a>
                                  </span>
                                  )
                              })
                          }
                      </Card>
                  </Col>
                  )
          }
          )
      }
      </Row>
)
};

export default Item;
