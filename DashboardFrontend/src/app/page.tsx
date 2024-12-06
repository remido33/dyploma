"use client";

import { FC } from 'react';
import Cta from '@/components/Cta';
import styles from '@/styles/home.module.css';
import InputWithCta from '@/components/InputWithCta';
import Image from 'next/image';
import Link from 'next/link';

const Home: FC = () => {
    return (
        <>
            <div className={styles.greeting}>
                <h1>Integrate. Scale. Thrive</h1>
                <p>Elevate your Shopify store with seamless mobile integration.</p>
                <InputWithCta 
                    label='email'
                    placeholder='Email'
                    onSubmit={() => null}
                    ctaText='Get Demo'
                />
            </div>

            <div className={styles.columns}>
                <div className={styles.columnsCard}>
                    <h2>Automated Integration</h2>
                    <p>Quick and seamless integration with Shopify, getting your mobile app up and running without delays.</p>
                </div>
                <div className={styles.columnsCard}>
                    <h2>Fast, Reliable Performance</h2>
                    <p>Optimized for speed, ensuring a smooth shopping experience with fast loading times.</p>
                </div>
                <div className={styles.columnsCard}>
                    <h2>Design and Customizations</h2>
                    <p>We adapt your designs to create a fully customized app that reflects your brand’s unique style.</p>
                </div>
            </div>

            <div className={styles.feature}>
                <div className={styles.featureMain}>
                    <h1>What is Remido?</h1>
                    <p>We weould like to give you amazing experience. For sure, it is necessary. Optimized for speed, ensuring a smooth shopping experience with fast loading times.</p>
                </div>
                <div className={styles.featureContent}>
                    <div className={styles.featureItem}>
                        <h2>Lorem ipsum</h2>
                        <p>Here we are talking about the item below. We weould like to give you amazing experience.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h2>Lorem ipsum</h2>
                        <p>Here we are talking about the item below. We weould like to give you amazing experience.</p>
                    </div>
                </div>
            </div>

            <div className={styles.fwBlock}>
                <h1>We provide quality!</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            
            <div className={styles.content}>
                <div className={styles.contentMain}>
                    <h1>Lorem Ipsum</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <Link href="#">
                        Explore now
                    </Link>
                </div>
                <div className={styles.desktopImg}>
                    <Image
                        alt='Feature' 
                        src={require('../public/desktop_img_1.webp')}
                    />
                </div>
                <div className={styles.mobileImg}>
                    <Image
                        alt='Feature' 
                        src={require('../public/mobile_img_1.webp')}
                    />
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.contentMain}>
                    <h1>Lorem Ipsum</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <Link href="#">
                        Explore now
                    </Link>
                </div>
                <div className={styles.desktopImg}>
                    <Image
                        alt='Feature' 
                        src={require('../public/desktop_img_1.webp')}
                    />
                </div>
                <div className={styles.mobileImg}>
                    <Image
                        alt='Feature' 
                        src={require('../public/mobile_img_1.webp')}
                    />
                </div>
            </div>

            <div className={styles.appeal}>
                <h1>Contact us</h1>
                <p>Elevate your Shopify store with seamless mobile integration with seamless mobile integration</p>
                <Cta variant='black'>
                    Get in touch
                </Cta>
            </div>
        </>
    )
};

export default Home;