import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
import time

# Load your trained model
model = tf.keras.models.load_model('final.h5')

# Define ASL classes ('A' to 'Z' and 'space')
classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Nothing', 'O', 'P', 'Q', 'R', 'S', 'Space', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

# Initialize MediaPipe Hands model
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5,
                       min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils  # Import drawing utilities

# Initialize webcam
cap = cv2.VideoCapture(0)


def preprocess_frame(frame):
    # Convert to RGB as MediaPipe Hands model expects RGB images
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Use MediaPipe to detect landmarks
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks on the frame
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Find bounding box around hand landmarks
            landmarks = hand_landmarks.landmark
            x_min, y_min = frame.shape[1], frame.shape[0]
            x_max, y_max = 0, 0
            for landmark in landmarks:
                x, y = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)

            # Ensure the extracted region is within bounds
            if 0 <= y_min < y_max <= frame.shape[0] and 0 <= x_min < x_max <= frame.shape[1]:
                # Draw rectangle around the hand (green color)
                cv2.rectangle(frame, (x_min - 20, y_min - 20), (x_max + 20, y_max + 20), (0, 255, 0), 2)

                # Extract ROI from the frame
                roi_frame = frame[max(0, y_min - 20):y_max + 20, max(0, x_min - 20):x_max + 20]

                # Resize ROI to match model'space expected sizing (128x128)
                resized_roi = cv2.resize(roi_frame, (128, 128))

                # Convert to grayscale
                gray_roi = cv2.cvtColor(resized_roi, cv2.COLOR_BGR2GRAY)

                # Normalize the ROI
                normalized_roi = gray_roi.astype('float32') / 255.0

                # Expand dimensions to create a batch of 1
                processed_roi = np.expand_dims(normalized_roi, axis=-1)

                return processed_roi, frame

    return None, frame


word_formed = ""
input_letter = ""
last_prediction_time = time.time()
final_prediction = ""  # To store the final prediction to be displayed in the input

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    if ret:
        # Mirror the frame horizontally
        frame = cv2.flip(frame, 1)

        # Preprocess frame to extract ROI and draw landmarks
        processed_roi, frame_with_landmarks = preprocess_frame(frame)

        if processed_roi is not None:
            current_time = time.time()
            time_elapsed = current_time - last_prediction_time

            if time_elapsed > 5.0:
                # Perform prediction on the processed ROI
                prediction = model.predict(np.expand_dims(processed_roi, axis=0))

                # Get predicted label
                predicted_index = np.argmax(prediction)
                final_prediction = classes[predicted_index]

                # Update last prediction time
                last_prediction_time = current_time

                # Update the word formed based on 'next', 'space', or letter
                if final_prediction == 'next':
                    word_formed += input_letter
                    input_letter = ""
                elif final_prediction == 'space':
                    if input_letter:
                        word_formed += input_letter + " "
                        input_letter = ""
                    else:
                        word_formed += " "
                else:
                    input_letter = final_prediction

        # Display the input letter on the frame
        cv2.putText(frame_with_landmarks, f'Predicted: {final_prediction}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (0, 255, 0), 2)

        # Display the word formed on the frame
        cv2.putText(frame_with_landmarks, f'Word formed: {word_formed}', (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (255, 0, 0), 2)

        # Display the frame
        cv2.imshow('Sign Language Recognition', frame_with_landmarks)

        # Exit if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Release the capture and close all windows
cap.release()
cv2.destroyAllWindows()
