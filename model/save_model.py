"""
Using the same code from the premier-league-match-predictions repository,
build the feature matrix and save the voting model to file.
"""
from joblib import dump
from sklearn.metrics import accuracy_score

from model.build_features import get_feature_matrix
from model.train_model import train_model
from model.config import MODEL_PATH, END_YEAR, NUM_SEASONS, N_MATCHES, SPORTSBOOK

if __name__ == "__main__":
    # Get the training and testing data.
    print('Engineering feature matrix...')
    X_train, y_train, X_test, y_test = get_feature_matrix(END_YEAR, NUM_SEASONS, N_MATCHES, SPORTSBOOK)
    
    # Train the model on the training data.
    print('Training the model...')
    model = train_model(X_train, y_train)
    
    # Evaluate the model based on the holdout set.
    y_pred = model.predict(X_test)
    
    # Print the models' accuracy.
    print(f'The testing accuracy of the model is {accuracy_score(y_test, y_pred):.5f}.')
    
    # Save the model to file.
    dump(model, MODEL_PATH)