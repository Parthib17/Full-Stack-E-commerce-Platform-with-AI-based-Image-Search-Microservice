// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import Swiper styles
import 'swiper/css';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';

import { bannerLists } from '../../utils';
import { Link } from 'react-router-dom';

const colors = ["bg-gradient-to-r from-teal-500 to-cyan-600", "bg-gradient-to-r from-rose-500 to-pink-600", "bg-gradient-to-r from-yellow-500 to-red-600"];

const HeroBanner = () => {
    // Reorder indices: original [0,1,2] becomes [1,2,0]
    const reorderedIndices = [1, 2, 0];

    return (
        <div className='py-4 rounded-xl shadow-2xl'>
            <style>
                {`
                    .swiper-button-next,
                    .swiper-button-prev {
                        color: white !important;
                    }
                    .swiper-button-next::after,
                    .swiper-button-prev::after {
                        color: white !important;
                    }
                `}
            </style>
            <Swiper
                grabCursor = {true}
                autoplay = {{
                    delay:4000,
                    disableOnInteraction: false,
                }}
                navigation
                modules={[Pagination, EffectFade, Navigation, Autoplay]}
                pagination={{clickable: true}}
                scrollbar={{ draggable: true}}
                slidesPerView={1}>
                
                    {reorderedIndices.map((originalIndex, i) => (
                        <SwiperSlide key={bannerLists[originalIndex].id}>
                            <div className={`carousel-item rounded-xl sm:h-[600px] h-[450px] ${colors[i]} overflow-hidden`}>
                                <div className='flex items-center justify-center h-full'>
                                    <div className='hidden lg:flex justify-center w-1/2 p-12'>
                                        <div className='text-center'>
                                            <h3 className='text-4xl text-white font-extrabold tracking-tight'>
                                                {bannerLists[originalIndex].title}
                                            </h3>
                                            <h1 className='text-6xl text-white font-bold mt-4 leading-tight'>
                                                {bannerLists[originalIndex].subtitle}
                                            </h1>
                                            <p className='text-gray-100 text-lg mt-6 max-w-md mx-auto'>
                                                {bannerLists[originalIndex].description}
                                            </p>
                                            <Link 
                                                className='mt-8 inline-block bg-white text-gray-900 py-3 px-6 rounded-full font-semibold text-lg hover:bg-gray-100 transition-transform transform hover:scale-105'
                                                to="/products">
                                                Shop
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-center lg:w-1/2 p-6'>
                                        <img src={bannerLists[originalIndex]?.image} className='object-contain max-h-[400px] rounded-lg shadow-lg'></img>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
}

export default HeroBanner;