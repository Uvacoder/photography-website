import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import Img from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import IndexPage from 'pages/index'
import { IGetPlaiceholderReturn } from 'plaiceholder'
import { GetServerSidePropsContext } from 'next'
import { getAllImages } from '@utils/getAll'
import Head from 'next/head'

const PhotoPage = ({ images }: { images: IGetPlaiceholderReturn[] }) => {
  const router = useRouter()

  const { id } = router.query
  const intId = parseInt(id as string)

  const onClose = () => {
    router.push('/')
  }

  const handleGalleryChange = (type: 'plus' | 'minus') => {
    if (typeof id === 'string') {
      const add = type === 'plus' ? 1 : -1
      let value = intId + add
      if (value >= images.length) {
        value = 0
      } else if (value < 0) {
        value = images.length - 1
      }

      router.push('/photo/[id]', `/photo/${value}`, { shallow: true })
    }
  }

  const currentImage = images[intId]

  return (
    <div className="grid">
      <Head>
        <meta property="og:image" content={currentImage.img.src} />
      </Head>
      <div className="stackedLayer">
        <IndexPage images={images} />
      </div>

      <div className="stackedLayer">
        <Transition.Root show={true} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={onClose}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true">
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div className="inline-block pointer-events-none align-bottom bg-transparent rounded-lg px-4 pt-5 pb-4 w-full h-full text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl  sm:w-full sm:p-6">
                  <div className="flex justify-center space-x-2 items-center w-full">
                    <button
                      className="focus:outline-none pointer-events-auto"
                      onClick={() => {
                        handleGalleryChange('minus')
                      }}>
                      <ChevronLeftIcon className="w-8 h-8 text-gray-50" />
                    </button>
                    <div className="mt-3 flex-1 text-center sm:mt-5 aspect-w-16 aspect-h-9 max-h-[60vh]">
                      <Img
                        layout="fill"
                        blurDataURL={currentImage.base64}
                        placeholder="blur"
                        src={currentImage.img.src}
                        className="object-contain"></Img>
                    </div>
                    <button
                      className="focus:outline-none pointer-events-auto"
                      onClick={() => {
                        handleGalleryChange('plus')
                      }}>
                      <ChevronRightIcon className="w-8 h-8 text-gray-50"></ChevronRightIcon>
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  )
}

export default PhotoPage

export const getStaticProps = async ({ params }: GetServerSidePropsContext) => {
  // Get all posts again

  if (!params) throw new Error('no params')

  const { id } = params

  if (!(typeof id === 'string')) {
    throw Error('Invalid id')
  }

  const images = await getAllImages()

  return {
    props: {
      images
    }
  }
}

export const getStaticPaths = async () => {
  // Get all posts again

  const images = await getAllImages()

  return {
    paths: images.map((_, index) => `/photo/${index}`),
    fallback: true
  }
}
