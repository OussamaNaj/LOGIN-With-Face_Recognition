import face_recognition
import sys
import io,base64

image=sys.argv[1]
known_image = face_recognition.load_image_file(io.BytesIO(base64.b64decode(image)))
unknown_image = face_recognition.load_image_file("/home/oussama/Desktop/FaceRecJs/backend/images/Oussama/1.jpg")


biden_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
results = face_recognition.compare_faces([biden_encoding], unknown_encoding)

print(results[0])
sys.stdout.flush()
