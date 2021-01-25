import React, {useState, useEffect} from 'react';
import {Button, Input, Modal, Table, message} from "antd";
import {connect} from "react-redux";
import {renderShop} from "../../root/actions/shopActions";
import axios from 'axios';
import {API_FORMAT, API_URL} from "../../FB_API/API";

const Shop = props => {

    useEffect(() => {
        props.renderShop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [name, setName] = useState('');
    const [count, setCount] = useState(null);
    const [modal, setModal] = useState(false);
    const [currentData, setCurrentData] = useState({});
    const [changeName, setChangeName] = useState('');
    const [changeCount, setChangeCount] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const columns = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Кол-во',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return (
                    <>
                        <input type="checkbox" checked={record.status} onChange={() => changeProductStatus(record.id, record.status, record.name, record.count)}/>
                        <span>{record.status ? 'Куплено' : 'Не куплено'}</span>
                    </>
                )
            }
        },
        {
            title: 'Действия',
            dataIndex: 'actions',
            key: 'actions',
            render: (value, record) => (
                <div className={'column-actions'}>
                    <Button type={'default'} onClick={() => openModal(record)}>Изменить</Button>
                    <Button type={'danger'} onClick={() => deleteProduct(record.id, record.name)}>Удалить</Button>
                </div>
            )
        },
    ];

    const valid = ((name === '') ||(count === null) || (count === ''));

    const addProduct = async () => {
        try {
            await axios.post(`${API_URL}/shop${API_FORMAT}`, {
                name,
                count,
                status: false
            });

            message.success(`Товар ${name} в количестве ${count} был успешно добавлен`);
        } catch (e) {
            message.error(`Ошибка добавления товара`);
            console.log(e);
        }

        props.renderShop();

        setName('');
        setCount(null);
    };

    const deleteProduct = async (id, name) => {
        try {
            await axios.delete(`${API_URL}/shop/${id}${API_FORMAT}`);

            message.success(`${name} успешно удалено`);
        } catch (e) {
            message.error(`Ошибка удаления товара`);
            console.log(e);
        }

        setModal(false);

        props.renderShop();
    };

    const editProduct = async (id, name, count, status) => {
        try {
            await axios.put(`${API_URL}/shop/${id}${API_FORMAT}`, {
                name: changeName === '' ? name : changeName,
                count: changeCount === '' ? count : changeCount,
                status
            });

            message.success(`${name} успешно изменено`);

            setModal(false);

            props.renderShop()
        } catch (e) {
            message.error(`Ошибка редакированя товара`);
            console.log(e)
        }
    };

    const changeProductStatus = async (id, status, name, count) => {

        try {
            setChangeStatus(!status);

            await axios.put(`${API_URL}/shop/${id}${API_FORMAT}`, {
                count,
                name,
                status: !status
            });

            props.renderShop();

            message.success(`Статус ${name} успешно изменен на ${status ? 'куплено' : 'не куплено'}`);
        } catch (e) {
            message.error(`Ошибка изменения статуса товара`);
            console.log(e)
        }
    };

    const closeModal = () => {
      setModal(false)
    };

    const openModal = data => {
      setCurrentData(data);
      setChangeName(data.name);
      setChangeCount(data.count);
      setChangeStatus(data.status);
      setModal(true)
    };

    return (
        <div className={'Shop'}>

            {Object.keys(currentData).length !== 0 ?
                <Modal
                    visible={modal}
                    onOk={closeModal}
                    onCancel={closeModal}
                    footer={[
                        <Button key={1} onClick={() => editProduct(currentData.id, currentData.name, currentData.count, currentData.status)} disabled={(changeName === '') || (changeCount === '')}>Сохранить</Button>,
                        <Button key={2} onClick={() => deleteProduct(currentData.id, currentData.name)}>Удалить</Button>,
                        <Button key={3} onClick={closeModal}>Отмена</Button>

                    ]}
                >
                    <div className={'modal'}>
                        <h1>Редактировать товар "{currentData.name}"</h1>

                        <div className="modal__content">
                            <Input placeholder={'Введите имя'} value={changeName} onChange={e => setChangeName(e.target.value)} />
                            <Input placeholder={'Введите кол-во'} value={changeCount} type={'number'} onChange={e => setChangeCount(e.target.value)} />
                            <input type="checkbox" checked={changeStatus} onChange={() => changeProductStatus(currentData.id, changeStatus, currentData.name, currentData.count)} />
                            <span>{changeStatus ? 'Куплено' : 'Не куплено'}</span>
                        </div>
                    </div>
                </Modal> : null
            }

                <div className="Shop__add">
                    <Input placeholder={'Введите имя'} value={name} onChange={e => setName(e.target.value)} />
                    <Input placeholder={'Введите кол-во'} value={count} type={'number'} onChange={e => setCount(e.target.value)} />

                    {!valid ?
                        <Button type={'default'} onClick={addProduct}>Добавить</Button> :
                        <Button type={'default'} disabled>Добавить</Button>
                    }
                </div>

            <div className="Shop__content">
                {props.shop.length !== 0 ?
                    <Table
                        dataSource={props.shop}
                        columns={columns}
                        rowClassName={record => record.status ? 'disabled' : 'active'}
                        pagination={false}
                    />
                    :
                    <h3>База данных пуста</h3>
                }
            </div>
        </div>
    )
};

function mapStateToProps(state) {
    return {
        shop: state.shopReducer.shop
    }
}

function mapDispatchToProps(dispatch) {
    return {
        renderShop: () => dispatch(renderShop())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Shop);