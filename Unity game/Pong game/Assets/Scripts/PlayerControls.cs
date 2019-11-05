using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerControls : MonoBehaviour
{
    public float speed = 10;

    private Rigidbody2D _rigidBody2D;
    // Start is called before the first frame update
    void Start()
    {
        _rigidBody2D = GetComponent<Rigidbody2D>();
        //_rigidBody2D = gameObject.AddComponent<Rigidbody2D>() as Rigidbody2D;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey("up"))
        {
            _rigidBody2D.velocity = new Vector2(0.0f, speed);
        }

        else if (Input.GetKey("down"))
        {
            _rigidBody2D.velocity = new Vector2(0.0f, speed * -1);
        }
        else
        {
            _rigidBody2D.velocity = new Vector2(0.0f, 0.0f);
        }
    }
}
