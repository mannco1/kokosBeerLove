import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ShopResponse } from "../../api/models/response/ShopResponse";
import ShopService from "../../api/services/ShopService";
import img1 from '../../images/T-shirt Mockup.png';
import img2 from '../../images/Kangaroo Pocket Pullover Hoodie Mockup.png';
import img3 from '../../images/memories-on-35mm-d8cwbw41IO8-unsplash.jpg'
import img4 from '../../images/image14.png'
import {ProductSize} from "../../api/models/ProductSize";
import './ShopDetails.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BasketService from '../../api/services/BasketService';

interface Product {
    name: string;
    price: number;
    oldPrice: number;
    image: string;
    rating: number;
    reviewsCount: number;
    colorOptions: string[];
    sizeOptions: string[];
    description: string;
    article: string;
    material: string;
    country: string;
    features: string;
    availability: string;
    storeRating: number;
    deliveryDate: string;
}
const imgarr:string[] = [img1,img2,img3,img4]

const ShopDetails = () => {
    const { id } = useParams<{ id: string }>();
    const productId = parseInt(id || '', 10);
    const [productItem, setProductItem] = useState<ShopResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const [selectedSize, setSelectedSize] = useState<string>('');

    

    const product: Product = {
        name: 'Футболка оверсайз с принтом черная',
        price: 997,
        oldPrice: 3500,
        image: '/path/to/image.jpg',
        rating: 4.8,
        reviewsCount: 1018,
        colorOptions: ['Черный', 'Белый'],
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Износостойкость, тренд',
        article: '154087085',
        material: '95% хлопок, 5% эластан',
        country: 'Китай',
        features: 'Без карманов, круглый вырез',
        availability: '12 октября, склад WB',
        storeRating: 4.7,
        deliveryDate: '14 дней на возврат',
    };

    useEffect(() => {
        fetchShop();
    }, []);

    const fetchShop = async () => {
        setIsLoading(true);
        try {
            const response = await ShopService.getProductId(productId);
            setProductItem(response.data);
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


    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        console.log(selectedSize)
    };

    const handleNextImage = () => {
        if (productItem?.url_images && productItem?.url_images.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === productItem?.url_images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };
    
    const handlePrevImage = () => {
        if (productItem?.url_images && productItem?.url_images.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? productItem?.url_images.length - 1 : prevIndex - 1
            );
        }
    };


    const addToBasket = async () => {
        try{
        if(selectedSize){
            await BasketService.addToBasket(productId, 1 , selectedSize)
            
        } else {
            
        }
    } catch (error) {
        setErrorMessage('Ошибка при сохранении игрока.');
    }
};
    
function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const newPrice = originalPrice - discountAmount;
    return Math.floor(newPrice); // Отбрасывает дробную часть
}



    return (
        <>
        <Header />
        <div className='container-shop-details'>
            
            <div className='content-shop-details'>
                <div className="product-image">
                    {/* <img src={productItem?.url_images[currentImageIndex]} alt={product.name} /> */}
                    <img src={imgarr[currentImageIndex]} alt='error'/>
                    <div className="image-navigation-buttons">
                        <button onClick={handlePrevImage} className="prev-image-button">Назад</button>
                        <button onClick={handleNextImage} className="next-image-button">Вперед</button>
                    </div>
                </div>
                <div className="product-card">
                    <div className="product-info">
                        <h1 className="product-name">{productItem?.name}</h1>
                        <div className="product-rating">
                            <span>⭐️ {product.rating}</span>
                            <span>({product.reviewsCount} отзывов)</span>
                        </div>
                        <div className="product-price">


                       
                         {
                            productItem?.price !== undefined && productItem?.discount !== undefined && productItem?.discount !==0 ? (
                                <>
                                    <span className="new-price">
                                        {calculateDiscountedPrice(productItem.price, productItem.discount)} ₽
                                    </span>
                                    <span className="old-price">{productItem.price} ₽</span>
                                </>
                            ) : (
                                <span className="new-price">{productItem?.price} ₽</span>
                            )
                        } 
                        </div>
                        <div className="product-sizes">
                            <p>Размеры:</p>
                            <div>
                            {productItem?.sizes.map((item, index) => (
                                <button
                                    key={index}  
                                    className={`size-option ${selectedSize === item.size ? 'selected' : ''}`}
                                    onClick={() => handleSizeSelect(item.size)}
                                    disabled={item.quantity === 0} // Блокируем кнопку, если количество равно 0
                                    style={{ backgroundColor: item.quantity === 0 ? 'gray' : '' }}
                                    
                                     // Задаем серый цвет для недоступных кнопок
                                > 
                                    {item.size}
                                </button>
                            ))}
                            </div>
                        </div>
                        <p>Описание: {productItem?.description}</p>
                        <div className="product-buttons">
                            {
                            selectedSize !== '' ?(
                            <button className="add-to-cart" onClick={addToBasket}>Добавить в корзину</button>
                            ):(
                                <button disabled={true} style={{ backgroundColor:  'gray'}} className="add-to-cart" onClick={addToBasket}>Добавить в корзину</button> 
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <Footer />
        </>
    );
};

export default ShopDetails;
