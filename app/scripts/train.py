import os
import sys
from PIL import Image
import face_recognition

def process_images(directory, name):
    # Get the previous directory of directory
    dir = os.path.join(directory, '..')

    # Create a new directory for the person's face
    os.makedirs(f'{dir}/faces/{name}', exist_ok=True)

    # Process each image in the directory
    for filename in os.listdir(directory):
        # Load the image
        image = face_recognition.load_image_file(f'{directory}/{filename}')

        # Find all the faces in the image
        face_locations = face_recognition.face_locations(image)

        # If faces were found, save each one to the new directory
        for i, face_location in enumerate(face_locations):
            top, right, bottom, left = face_location

            face_image = image[top:bottom, left:right]
            pil_image = Image.fromarray(face_image)
            
            pil_image.save(f'{dir}/faces/{name}/{name}_{i}.jpg')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python train.py [directory] [name]")
    else:
        process_images(sys.argv[1], sys.argv[2])
