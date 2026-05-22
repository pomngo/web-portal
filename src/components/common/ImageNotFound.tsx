import { images } from "../../constants/images"


const ImageNotFound = () => {
  return (
    <div>
      <img src={`${images.not_found}`} alt="" className="" />
    </div>
  )
}

export default ImageNotFound
