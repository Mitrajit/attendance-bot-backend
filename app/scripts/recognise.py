import face_recognition
import cv2
import os
import numpy as np
from PIL import Image

def recognize_face(input_image):
    known_face_encodings = []
    known_face_names = []

    facesPath = os.path.join(os.path.dirname(__file__), '../../data/faces')
    # Load and encode sample pictures
    for dirpath, dnames, fnames in os.walk(facesPath):
        for f in fnames:
            if f.endswith(".jpg") or f.endswith(".png"):
                face = face_recognition.load_image_file(f"{dirpath}/{f}")
                face_encoding = face_recognition.face_encodings(face)[0]
                known_face_encodings.append(face_encoding)
                known_face_names.append(dirpath)

    # Load image to check
    unknown_image = face_recognition.load_image_file(input_image)

    # Find all the faces and face encodings in the unknown image
    face_locations = face_recognition.face_locations(unknown_image)
    face_encodings = face_recognition.face_encodings(unknown_image, face_locations)

    # Convert the image to a PIL-format image so that we can draw on top of it with the Pillow library
    pil_image = Image.fromarray(unknown_image)
    # Loop through each face found in the unknown image
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        # Use the known face with the smallest distance to the new face
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]

        print(f"{name}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python recognize.py [filename]")
    else:
        recognize_face(sys.argv[1])