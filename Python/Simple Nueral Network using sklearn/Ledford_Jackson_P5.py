# -*- coding: utf-8 -*-
"""
Created on Wed Apr 20 21:56:02 2022

@author: Jackson Ledford
"""

import pandas as pd
from sklearn.neural_network import MLPClassifier

# Import necessary modules
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix


fileName = "wine.data"

inputs = pd.read_csv(fileName, sep=",", index_col=False, names=['Wine Type', 'Alcohol', 'Malic acid', 'Ash', 'Alcalinity of ash', 'Magnesium', 'Total phenols', 'Flavanoids', \
                                                                'Nonflavanoid phenols', 'Proanthocyanins', 'Color intensity', 'Hue', 'OD280/OD315 of diluted wine', 'Proline'])

x = inputs.drop('Wine Type', axis = 1)
y = inputs['Wine Type']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.69)

mlp = MLPClassifier(hidden_layer_sizes = (7), max_iter = 10000, n_iter_no_change = 5000, learning_rate_init = 0.0005, activation = 'identity')

mlp.fit(x_train, y_train)
    
pred = mlp.predict(x_test)

confusion = confusion_matrix(y_test, pred)

print(confusion)

print(classification_report(y_test,pred))