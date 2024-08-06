import tensorflow as tf
import numpy as np
import cv2
import mediapipe as mp

# Load the trained model
model = tf.keras.models.load_model('final.h5')

# Define image size and classes
IMG_SIZE = 256
classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'NEXT', 'O', 'P', 'Q', 'R', 'S', 'SPACE', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


# Initialize webcam
cap = cv2.VideoCapture(0)

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # If frame is read correctly, ret is True
    if not ret:
        print("Failed to capture image")
        break

    # Convert the frame to RGB as required by MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame to detect hands
    result = hands.process(rgb_frame)

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            # Draw hand landmarks on the frame
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Extract bounding box of the hand
            h, w, _ = frame.shape
            x_min = w
            y_min = h
            x_max = y_max = 0

            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                if x < x_min:
                    x_min = x
                if y < y_min:
                    y_min = y
                if x > x_max:
                    x_max = x
                if y > y_max:
                    y_max = y

            # Add some margin to the bounding box
            margin = 20
            x_min = max(0, x_min - margin)
            y_min = max(0, y_min - margin)
            x_max = min(w, x_max + margin)
            y_max = min(h, y_max + margin)

            # Extract the hand region from the frame
            hand_region = frame[y_min:y_max, x_min:x_max]

            # Convert the hand region to grayscale
            gray_hand_region = cv2.cvtColor(hand_region, cv2.COLOR_BGR2GRAY)

            # Apply horizontal flip
            flipped_hand_region = cv2.flip(gray_hand_region, 1)

            # Resize the grayscale hand region to match the input size of the model
            resized_hand = cv2.resize(flipped_hand_region, (IMG_SIZE, IMG_SIZE))

            # Normalize the image
            normalized_hand = resized_hand / 255.0

            # Reshape to match the input shape of the model
            input_image = np.expand_dims(normalized_hand, axis=0)
            input_image = np.expand_dims(input_image, axis=-1)

            # Debug: Show intermediate steps
            cv2.imshow('Gray Hand Region', gray_hand_region)
            cv2.imshow('Flipped Hand Region', flipped_hand_region)
            cv2.imshow('Resized Hand Region', resized_hand)

            # Make prediction
            prediction = model.predict(input_image)
            predicted_class = classes[np.argmax(prediction)]

            # Display the prediction on the frame
            cv2.putText(frame, f'Prediction: {predicted_class}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2,
                        cv2.LINE_AA)

    # Display the resulting frame
    cv2.imshow('Sign Language Prediction', frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture
cap.release()
cv2.destroyAllWindows()
