import React, { useContext, useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import axios from 'axios';
import BasketService from '../api/services/BasketService';
import { ShopResponse } from "../api/models/response/ShopResponse"
import img from '../images/T-shirt Mockup.png'

interface BasketType  {
    id:number;
    product_name: number,
    description: string,
    url_images: string[],
    size: string,
    quantity: number
}



const Basket: React.FC<{ open: boolean, handleClose: () => void }> = ({ open, handleClose }) => {
   
    const[isBuying,setBuying]=useState<BasketType[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

useEffect(()=>{
    fetchBacket()
},[])


const fetchBacket = async () => {
    setIsLoading(true);
    try {
        const response = await BasketService.getAllBasket();
        setBuying(response.data);
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            setErrorMessage('Товары не найдены.');
        } else {
            setErrorMessage('Ошибка загрузки товаров.');
        }
    } finally {
        setIsLoading(false);
    }
};








const handleRemoveItem = async (productId: number, size: string) => {
    try {
        setIsLoading(true);
        
        // Вызываем API для удаления одного товара с переданным productId и size
        await BasketService.removeItemFromBasket(productId, size);

        // Обновляем состояние корзины, уменьшая количество товара
        setBuying((prevItems) => {
            return prevItems
                .map((item) => {
                    if (item.id === productId && item.size === size) {
                        // Если количество больше 1, уменьшаем его
                        if (item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        // Если количество равно 1, возвращаем `undefined`, чтобы удалить элемент
                        return undefined; // Возвращаем undefined для удаления элемента
                    }
                    return item; // Возвращаем неизменённый элемент
                })
                .filter((item): item is BasketType => item !== undefined); // Фильтруем undefined
        });
    } catch (error) {
        setErrorMessage('Ошибка при удалении товара из корзины.');
    } finally {
        setIsLoading(false);
    }
};








    // Функция для перехода к оформлению заказа
    const handleCheckout = () => {
        handleClose();
        // Логика для перехода на страницу оформления заказа
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '30px',
                    width: '500px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: "red"
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" sx={{ mb: 2, color: '#E62526', fontSize: "30px" }}>
                    Корзина
                </Typography>

                {isBuying.length > 0 ? (
                    <>
                        <List>
                            {isBuying.map((item,index) => (
                                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={item.url_images[0] || img} alt="error" style={{ width: '50px', marginRight: '15px' }} />
                                    <ListItemText
                                        primary={`Название: ${item.product_name}`}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Размер: {item.size}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Количество: {item.quantity}
                                                </Typography>
                                            </>
                                        }
                                    />

                                    <ListItemSecondaryAction >
                                        <IconButton edge="end" onClick={() => handleRemoveItem(item.id,item.size)}>
                                                                                                        
                                                                                                        
                                            <DeleteIcon sx={{ color: '#E62526' }} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: '#E62526',
                                color: 'white',
                                borderRadius: '12px',
                                width: "100%"
                            }}
                            onClick={handleCheckout}
                        >
                            Перейти к оформлению
                        </Button>
                    </>
                ) : (
                    <Typography sx={{ mt: 2, color: 'gray' }}>
                        Ваша корзина пуста.
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default observer(Basket);
