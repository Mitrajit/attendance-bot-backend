import cv2
import os

def capture_images(directory="fc", num_images=5):
    cap = cv2.VideoCapture(0)

    os.makedirs(directory, exist_ok=True)
    image_counter = 0

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        cv2.imshow('Image Capturer', frame)

        if cv2.waitKey(1) & 0xFF == ord(' '): # If spacebar is pressed
            # Save the resulting frame
            cv2.imwrite(f'{directory}/image_{image_counter}.jpg', frame)
            print(f'Image saved at {directory}/image_{image_counter}.jpg')
            image_counter += 1

            if image_counter >= num_images: # If we've gathered enough images
                break

        elif cv2.waitKey(1) & 0xFF == ord('q'): # If 'q' is pressed
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    capture_images()
