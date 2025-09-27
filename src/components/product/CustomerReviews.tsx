import { Rating } from '@mui/material'
import React from 'react'

const CustomerReviews = () => {
    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-4 border-b-1 border-gray-300 pb-4'>
                    <div className='w-full md:w-[88%]'>
                        <div className='flex mb-5 gap-x-2'>
                            <h2>Ramesh Kumar</h2>
                            <Rating
                                name="half-rating-read"
                                defaultValue={5}
                                precision={0.5}
                                readOnly
                                className='text-green-500 text-2xl'
                            />
                        </div>
                        <p>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p>2 days ago</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 border-b-1 border-gray-300 pb-4'>
                    <div className='w-full md:w-[88%]'>
                        <div className='flex mb-5 gap-x-2'>
                            <h2>Shivangi Dhar</h2>
                            <Rating
                                name="half-rating-read"
                                defaultValue={4}
                                precision={0.5}
                                readOnly
                                className='text-green-500 text-2xl'
                            />
                        </div>
                        <p>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p>5 days ago</p>
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
                                className='text-green-500 text-2xl'
                            />
                        </div>
                        <p>Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.Naturally flavored with plant extracts and stevia for a refreshing taste—no artificial sweeteners or additives.Clean, light flavor powered by nature.</p>
                    </div>
                    <div className='w-full md:w-[8%]'>
                        <div>
                            <p>8 days ago</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CustomerReviews
