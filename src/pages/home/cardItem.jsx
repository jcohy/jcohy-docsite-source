import React from 'react';
import {Card, Icon, Divider, Button, Col, Row, Typography} from 'antd';
import 'antd/dist/antd.css';
import {getLink} from '../../../utils';

const Item = (props) => {
    const {cardItem} = props;
    const {Paragraph} = Typography;
    return (
        <Row type="flex">
            {
                cardItem.children.map((itemList, i) => {
                        return (
                            <Col span={8}>
                                <Card
                                    style={{width: 380, marginBottom: '20px', marginLeft: '20px'}}
                                    cover={
                                        <img
                                            style={{margin: '10px auto',height:'170px'}}
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
                                    <Divider>{itemList.title}</Divider>
                                    <Paragraph>
                                        {itemList.description}
                                    </Paragraph>
                                    {
                                        itemList.categories.map((category) => {
                                            return (
                                                <span>
                                                    <Divider/>
                                                        <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/>&nbsp;&nbsp;
                                                            <a href={getLink(category.link)} target={category.target || '_self'}>{category.title}</a>
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
