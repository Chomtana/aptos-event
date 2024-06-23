'use client'
import Layout from "@/components/layout/Layout"
import { useCollection } from "@/components/providers/CollectionProvider"
import Link from "next/link"
import { useState } from 'react'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { v4 as uuid } from "uuid"
import AIMintFactoryABI from "../../components/utils/AIMintFactoryABI"
import axios from "axios"
import { useWeb3Modal } from "@web3modal/wagmi/react"

const HOST = process.env.NEXT_PUBLIC_API_HOST

function imgSrc(collection, id) {
    if (collection.loading) return "/assets/images/loading.webp"
    if (!collection.collectionId) return "/assets/images/items/item-26.png"
    return `${HOST}/images/${collection.collectionId}-${id}.png`
}

function openseaUrl(collection, id) {
    return `https://optimism-sepolia.blockscout.com/token/${collection.contractAddress}/instance/${id}`
}

function openseaCollectionUrl(collection) {
    return `https://optimism-sepolia.blockscout.com/token/${collection.contractAddress}`
}

export default function Collections() {
    const { address, isConnected } = useAccount()
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [ collection, dispatch ] = useCollection()
    const { open } = useWeb3Modal()

    const [ prompt, setPrompt ] = useState()

    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()
    
    return (
        <>

            <Layout headerStyle={1} footerStyle={1} imgNum="group-ntf-04">
                <div>
                    <section className="tf-section collection">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="block-text center">
                                        <h1 className="heading-bg" data-aos="fade-in" data-aos-duration={1000}><span>MINT</span></h1>
                                        <h5 className="sub-title mb-10" data-aos="fade-up" data-aos-duration={1000}>Generative AI Mint</h5>
                                        <h3 className="title mb-28" data-aos="fade-up" data-aos-duration={1000}>Harness the power of state-of-the-art AI</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-50">
                                <div className="col-xl-7 col-md-12">
                                    <div className="group-image">
                                        <div className="swiper gallery-top">
                                            <Swiper
                                                spaceBetween={10}
                                                navigation={{
                                                    nextEl: '.swiper-button-next',
                                                    prevEl: '.swiper-button-prev',
                                                }}
                                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                                modules={[FreeMode, Navigation, Thumbs]} className="swiper-wrapper">
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 0)} className="item w-100" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 1)} className="item w-100" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 2)} className="item w-100" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 3)} className="item w-100" alt="Image" /></div></SwiperSlide>
                                                {/* <SwiperSlide><div className="item bg-2"><img src="/assets/images/items/item-26.png" alt="Image" /></div></SwiperSlide> */}
                                            </Swiper>
                                        </div>
                                        {/* Add Arrows */}
                                        <div className="swiper-button-next swiper-button-white" />
                                        <div className="swiper-button-prev swiper-button-white" />
                                        <div className="swiper gallery-thumbs">
                                            <Swiper
                                                onSwiper={setThumbsSwiper}
                                                spaceBetween={10}
                                                slidesPerView={4}
                                                freeMode={true}
                                                watchSlidesProgress={true}
                                                modules={[FreeMode, Navigation, Thumbs]} className="swiper-wrapper">
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 0)} className="item w-100 h-auto" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 1)} className="item w-100 h-auto" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 2)} className="item w-100 h-auto" alt="Image" /></div></SwiperSlide>
                                                <SwiperSlide><div className="item bg-2"><img src={imgSrc(collection, 3)} className="item w-100 h-auto" alt="Image" /></div></SwiperSlide>
                                                {/* <SwiperSlide><div className="item bg-2"><img src="/assets/images/items/item-26.png" alt="Image" /></div></SwiperSlide> */}
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-5 col-md-12">
                                    <div className="block-text">
                                        <h6 className="sub-title mb-6" data-aos="fade-up">AI Mint</h6>
                                        <h2 className="title mb-26" data-aos="fade-up">Unleash Your Imagination, Mint Your Vision</h2>
                                        <p className="desc mb-43" data-aos="fade-up">Describe what you envision. Our advanced AI generates art that reflects your ideas.</p>

                                        {!collection.collectionId && <>
                                            {!isConnected ? (
                                                <a className="btn-action style-2" data-aos="fade-up" data-aos-duration={1200} onClick={() => open()}>
                                                    {isConnected && address ? addressParse(address) : "Connect"}
                                                </a>
                                            ) : (
                                                <div>
                                                    <div className="d-flex w-100 mb-4">
                                                        <div style={{ flexGrow: 1 }}>
                                                            <textarea className="form-control" type="text" placeholder={"Enter Your Prompt: Describe what you envision.\nFor i.e, A Digital Art Cat In The Space"} required value={prompt} onChange={e => setPrompt(e.target.value)}>
                                                            </textarea>
                                                        </div>
                                                    </div>

                                                    <div style={collection.loading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                                                        <a className="btn-action style-2" data-aos="fade-up" data-aos-duration={1200} onClick={async () => {
                                                            try {
                                                                dispatch({ type: 'SET_LOADING', payload: true })

                                                                const collectionId = uuid()

                                                                const hash = await writeContractAsync({
                                                                    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
                                                                    abi: AIMintFactoryABI,
                                                                    functionName: 'cloneNFT',
                                                                    args: [
                                                                        prompt,
                                                                        'AIMINT',
                                                                        collectionId,
                                                                        address,
                                                                        4,
                                                                    ],
                                                                })

                                                                const tx = await publicClient.waitForTransactionReceipt({ hash })

                                                                dispatch({ type: 'SET_CONTRACT_ADDRESS', payload: tx.logs[0].address })

                                                                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/generate-images`, {
                                                                    collection_id: collectionId,
                                                                    prompt,
                                                                })

                                                                dispatch({ type: 'SET_COLLECTION_ID', payload: collectionId })
                                                            } catch (err) {
                                                                console.error(err)
                                                            } finally {
                                                                dispatch({ type: 'SET_LOADING', payload: false })
                                                            }
                                                        }}>Mint</a>
                                                    </div>
                                                </div>
                                            )}
                                        </>}

                                        {collection.collectionId && <>
                                            <h3 className="fs-30 mt-19">Your On-Chain NFT Links</h3>
                                            <ul className="nft s2">
                                                <li><Link href={openseaCollectionUrl(collection)} target="_blank"><i className="fas fa-external-link-alt" /><span>Blockscout</span></Link></li>
                                                {/* <li><Link href="#"><i className="fas fa-external-link-alt" /><span>Rarible</span></Link></li> */}
                                            </ul>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* end collection */}
                    {/* ai-mint */}
                    <section className="tf-section montono d-none">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="block-text center">
                                        <h1 className="heading-bg" data-aos="fade-in" data-aos-duration={1000}><span>Collections</span></h1>
                                        <h5 className="sub-title mb-10" data-aos="fade-up" data-aos-duration={1000}>NFT Portfolio Collections</h5>
                                        <h3 className="title mb-28" data-aos="fade-up" data-aos-duration={1000}>Checkout Our NFT<br /> Collections</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row mt-52">
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-02.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-01.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-05.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-04.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-06.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-07.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-02.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-01.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="image-box" data-aos="fade-up" data-aos-duration={1000}>
                                        <img src="/assets/images/items/montono-05.png" alt="AI-Mint" />
                                        <div className="image-box__title">
                                            <Link href="/collections" className="h6">AI-Mint item 1</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="load-more center">
                                        <Link id="loadmore" className="btn-action" href="#">
                                            Load More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* end Montono */}
                    {/* Action */}
                    <section className="tf-section action d-none">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="action__body" data-aos="fade-up">
                                        <div className="block-text">
                                            <h3 className="mb-13">Create Your NFT Today</h3>
                                            <p className="fs-21 mb-7">Join AI-Mint Now and Start Creating!</p>
                                        </div>
                                        <Link href="#" className="btn-action style-2">Join Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


            </Layout>
        </>
    )
}