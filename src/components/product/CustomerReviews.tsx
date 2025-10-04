import { Rating } from '@mui/material'
import React from 'react'

const CustomerReviews = () => {
    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-4 border-b-1 border-gray-300 md:pb-4 pb-2'>
                    <div className='w-full md:w-[88%]'>
                        <div className='flex mb-5 gap-x-2'>
                            <h2 className=''>Ramesh Kumar</h2>
                            <Rating
                                name="half-rating-read"
                                defaultValue={5}
                                precision={0.5}
                                readOnly
                                className='text-green-500 md:text-2xl text-xl'
                            />
                        </div>
                        <p className='md:text-[15px] text-[13px] leading-tight font-light'>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p className='md:text-[15px] text-[13px] leading-tight font-light'>2 days ago</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 border-b-1 border-gray-300 md:pb-4 pb-2'>
                    <div className='w-full md:w-[88%]'>
                        <div className='flex mb-5 gap-x-2'>
                            <h2>Shivangi Dhar</h2>
                            <Rating
                                name="half-rating-read"
                                defaultValue={4}
                                precision={0.5}
                                readOnly
                                className='text-green-500 md:text-2xl text-xl'
                            />
                        </div>
                        <p className='md:text-[15px] text-[13px] leading-tight font-light'>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p className='md:text-[15px] text-[13px] leading-tight font-light'>5 days ago</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4'>
                    <div className='w-full md:w-[88%]'>
                        <div className='flex mb-5 gap-x-2'>
                            <h2>Anjan Dutta</h2>
                            <Rating
                                name="half-rating-read"
                                defaultValue={5}
                                precision={0.5}
                                readOnly
                                className='text-green-500 md:text-2xl text-xl'
                            />
                        </div>
                        <p className='md:text-[15px] text-[13px] leading-tight font-light'>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p className='md:text-[15px] text-[13px] leading-tight font-light'>8 days ago</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CustomerReviews
